import {GithubRepoLoader} from "@langchain/community/document_loaders/web/github"
import {Document} from "@langchain/core/documents"
import { generateEmbedding, Summarize, SummarizeCode } from "./gemini"
import { db } from "@/server/db"

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
    const embeddings = await generateEmbeddings(docs)
    await Promise.allSettled(embeddings.map(async (embedding) => {
        
        console.log(`currently processing ${embedding.fileName}`)
        if(!embedding) return

        const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
            data : {
                sourceCode : embedding.sourceCode,
                fileName : embedding.fileName,
                summary : embedding.summary,
                gitProjectId : gitProjectId,
            }
        })
        await db.$executeRaw`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = ${embedding.embedding}::vector
        WHERE "id" = ${sourceCodeEmbedding.id}
        `
    }))
}

const generateEmbeddings = async(docs: Document[]) => {
    return await Promise.all(docs.map(async (doc) => {
       const summary = await SummarizeCode(doc)
       const embedding = await generateEmbedding(summary)
       return {
        summary,
        embedding,
        sourceCode : JSON.parse(JSON.stringify(doc.pageContent)),
        fileName : doc.metadata.source
       }
    }))
}