import { db } from "@/server/db";
import { Octokit } from "octokit";
import { Summarize } from "./gemini";
import axios from "axios";

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

    const summaries: string[] = [];

    for (const commit of unprocessedCommits) {
        try {
            // Delay before summarizing each commit
            await delay(2000); // Adjust the delay as needed (e.g., 2000 ms = 2 seconds)
            const summary = await summarizeCommit(githubUrl , commit.commitHash)
            summaries.push(summary || "No summary available")
        } catch (error) {
            console.error(`Failed to summarize commit ${commit.commitHash}:`, error);
            summaries.push("No summary available"); // Fallback for failed summaries
        }
    }

    const commit = await db.gitCommit.createMany({
        data : summaries.map((summary , index) => {
            console.log(`processing commit ${index + 1} of ${unprocessedCommits.length}`)
            return(
                {
                    gitProjectId: projectId,
                    commitHash: unprocessedCommits[index]!.commitHash,
                    commitMessage: unprocessedCommits[index]!.commitMessage,
                    commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
                    commitAuthorAvatarUrl: unprocessedCommits[index]!.commitAuthorAvatarUrl,
                    commitDate: unprocessedCommits[index]!.commitDate,
                    summary: summary,
                }
            )
        })
    })

    return commit

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

async function summarizeCommit(githubUrl: string , commitHash: string) {
    const {data} = await axios.get(`${githubUrl}/commit/${commitHash}.diff` , {
        headers: {
            Accept : 'application/vnd.github.v3.diff'
        }
    })
    return await Summarize(data) ||  ""
}