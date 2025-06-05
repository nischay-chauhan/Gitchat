import { db } from "@/server/db";
import { Octokit } from "octokit";
import { Summarize } from "./gemini"; // Assuming Summarize might be used elsewhere or can be removed if not
import axios from "axios";
import { addSummarizationJob } from "./queue";
import { JobType } from "@prisma/client";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const githubUrl = "https://github.com/nischay-chauhan/Coding-Practise"

interface Response{
    commitHash: string;
    commitMessage: string;
    commitAuthorName: string;
    commitAuthorAvatarUrl: string;
    commitDate: string;
}

// Utility function to create a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getCommitsHashes = async (githubUrl: string): Promise<Response[]> => {
    const [owner , repo] = githubUrl.split("/").slice(-2)
    if(!owner || !repo) {
        throw new Error("Invalid GitHub URL");
    }
 const {data} = await octokit.rest.repos.listCommits({
    owner: owner!,
    repo: repo!,
 });
 const comits = data.sort((a, b) => {
    const dateA = a?.commit?.author?.date ?? '';
    const dateB = b?.commit?.author?.date ?? '';
    return new Date(dateB).getTime() - new Date(dateA).getTime();
 }) as any;

    return comits.slice(0 , 12).map((commit:any) => ({
        commitHash: commit.sha as string,
        commitMessage: commit.commit.message ?? "",
        commitAuthorName: commit.commit.author.name ?? "",
        commitAuthorAvatarUrl: commit.author.avatar_url ?? "",
        commitDate: commit.commit.author.date ?? "",
    }));

};

export const pullCommits = async (projectId: string) => {
    const {project , githubUrl} = await getProjectUrl(projectId)

    const commitHashes = await getCommitsHashes(githubUrl)
    const unprocessedCommits = await filterUnprocessedCommits(projectId , commitHashes)

    // No longer collecting summaries directly here
    // const summaries: string[] = [];

    for (const commit of unprocessedCommits) {
        try {
            // No longer delaying here, summarization is async
            // await delay(2000);
            const diffContent = await summarizeCommit(githubUrl , commit.commitHash);

            if (diffContent) {
                await addSummarizationJob({
                    jobType: JobType.COMMIT_DIFF,
                    targetId: commit.commitHash,
                    payload: diffContent,
                    gitProjectId: projectId,
                });
                console.log(`Enqueued summarization job for commit: ${commit.commitHash}`);
            } else {
                console.warn(`No diff content fetched for commit ${commit.commitHash}, skipping job enqueue.`);
            }
        } catch (error) {
            console.error(`Failed to process or enqueue commit ${commit.commitHash}:`, error);
            // Decide if you want to create a GitCommit entry even if job enqueuing fails
        }
    }

    // Create GitCommit entries with a placeholder summary
    const commitCreationData = unprocessedCommits.map((commit) => ({
        gitProjectId: projectId,
        commitHash: commit.commitHash,
        commitMessage: commit.commitMessage,
        commitAuthorName: commit.commitAuthorName,
        commitAuthorAvatarUrl: commit.commitAuthorAvatarUrl,
        commitDate: commit.commitDate,
        summary: "Summary pending...", // Placeholder summary
    }));

    if (commitCreationData.length > 0) {
        const createdCommits = await db.gitCommit.createMany({
            data: commitCreationData,
            skipDuplicates: true, // Good to have if there's any chance of reprocessing
        });
        console.log(`Created ${createdCommits.count} GitCommit entries.`);
        return createdCommits;
    } else {
        console.log("No new commits to create entries for.");
        return { count: 0 }; // Or handle as appropriate
    }
}

async function getProjectUrl(projectId: string) {
    const project = await db.gitProject.findUnique({
        where: {
            id: projectId,
        },
        select: {
            repoUrl: true,
        },
    });

    if(!project) {
        throw new Error("Project not found");
    }

    return { project, githubUrl: project.repoUrl };
}

async function filterUnprocessedCommits(projectId: string , commitHashes: Response[]) {
    const processedCommitHashes = await db.gitCommit.findMany({
        where: {
            gitProjectId: projectId,
        },
        select: {
            commitHash: true,
        },
    });

    return commitHashes.filter((commit) => !processedCommitHashes.some((processedCommit) => processedCommit.commitHash === commit.commitHash));
}

// Now returns the diff content string, or null if an error occurs
async function summarizeCommit(githubUrl: string , commitHash: string): Promise<string | null> {
    try {
        const {data} = await axios.get(`${githubUrl}/commit/${commitHash}.diff` , {
            headers: {
                Accept : 'application/vnd.github.v3.diff'
            }
        });
        return data;
    } catch (error) {
        console.error(`Failed to fetch diff for commit ${commitHash}:`, error);
        return null; // Return null or throw, depending on desired error handling for the caller
    }
}