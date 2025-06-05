import {GithubRepoLoader} from "@langchain/community/document_loaders/web/github"
import {Document} from "@langchain/core/documents"
import { generateEmbedding, Summarize, SummarizeCode } from "./gemini" // Assuming SummarizeCode might be used elsewhere or can be removed if not
import { db } from "@/server/db"
import { addSummarizationJob } from "./queue";
import { JobType } from "@prisma/client";

export const LoadGithubRepo = async(repoUrl: string , githubToken?: string) => {
    const loader = new GithubRepoLoader(repoUrl, {
        accessToken: process.env.GITHUB_TOKEN || '',
        branch: 'main',
        ignoreFiles: [
            'node_modules',
            'package-lock.json',
            'package.json',
            'yarn.lock',
            'pnpm-lock.yaml'
        ],
        recursive: true,
        unknown: 'warn',
        maxConcurrency: 5,
    })
    const docs = await loader.load()
    return docs
    /*
    
    Document {
    pageContent: "ared_ptr<Customer> customer) {\n        customers.push_back(customer);\n    }\n\n    shared_ptr<Account> createAccountForCustomer(shared_ptr<Customer> customer, const string& accNum) {\n        auto account = make_shared<Account>(accNum);\n        customer->addAccount(account);\n        return account;\n    }\n};\n\nint main() {\n    Bank bank;\n    auto customer = make_shared<Customer>(\"John Doe\");\n    bank.addCustomer(customer);\n\n    auto account = bank.createAccountForCustomer(customer, \"123456789\");\n    account->deposit(500, \"2025-02-03\");\n    account->withdraw(200, \"2025-02-03\");\n    account->printTransactions();\n    customer->printAccounts();\n\n    return 0;\n}",
    metadata: {
      source: "Practise/c.cpp",
      repository: "https://github.com/nischay-chauhan/System-Design",
      branch: "main",
    },
    id: undefined,
  }
]

    */
}


export const IndexGithubRepo = async(gitProjectId: string, repoUrl: string , githubToken?: string) => {
    const docs = await LoadGithubRepo(repoUrl, githubToken)
    // generateEmbeddings now primarily enqueues jobs and returns targetIds (file paths)
    const enqueuedFilePaths = await generateEmbeddings(docs, gitProjectId)

    // Create initial SourceCodeEmbedding entries
    await Promise.allSettled(docs.map(async (doc) => {
        const filePath = doc.metadata.source;
        // Ensure this doc was actually enqueued if there was any filtering in generateEmbeddings
        if (enqueuedFilePaths.includes(filePath)) {
            console.log(`Creating initial embedding entry for ${filePath}`)
            try {
                await db.sourceCodeEmbedding.create({
                    data: {
                        sourceCode: doc.pageContent,
                        fileName: filePath,
                        summary: "Summary pending...", // Placeholder summary
                        gitProjectId: gitProjectId,
                        // summaryEmbedding will be updated by the worker
                    }
                });
            } catch (error) {
                console.error(`Failed to create initial SourceCodeEmbedding for ${filePath}:`, error);
            }
        }
    }))
    console.log(`Enqueued ${enqueuedFilePaths.length} documents for summarization.`);
}

// Modified to accept gitProjectId and enqueue jobs
const generateEmbeddings = async(docs: Document[], gitProjectId: string): Promise<string[]> => {
    const enqueuedTargetIds: string[] = [];
    await Promise.all(docs.map(async (doc) => {
       try {
        await addSummarizationJob({
            jobType: JobType.SOURCE_CODE,
            targetId: doc.metadata.source, // Using file path as targetId
            payload: doc.pageContent,      // Full content as payload
            gitProjectId: gitProjectId,
        });
        enqueuedTargetIds.push(doc.metadata.source);
        console.log(`Enqueued summarization job for: ${doc.metadata.source}`);
       } catch (error) {
        console.error(`Failed to enqueue summarization job for: ${doc.metadata.source}`, error);
       }
    }));
    return enqueuedTargetIds;
}