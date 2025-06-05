import { db } from "../server/db"; // Adjusted path
import { Summarize, SummarizeCode, generateEmbedding } from "../lib/gemini";
import { JobType, JobStatus, SummarizationJob, GitCommit, SourceCodeEmbedding } from "@prisma/client";
import { Document } from "@langchain/core/documents"; // For SummarizeCode

const MAX_RETRIES = 3;
const POLL_INTERVAL_MS = 10000; // 10 seconds
const BATCH_SIZE = 5; // Process 5 jobs at a time

async function main() {
  console.log("Summarization worker started...");

  while (true) {
    let jobs: SummarizationJob[] = [];
    try {
      jobs = await db.summarizationJob.findMany({
        where: {
          status: JobStatus.PENDING,
        },
        orderBy: {
          createdAt: "asc",
        },
        take: BATCH_SIZE,
      });
    } catch (error) {
      console.error("Worker: Error fetching pending jobs:", error);
      // Wait before trying to fetch jobs again if DB connection fails
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
      continue;
    }

    if (jobs.length === 0) {
      // console.log("Worker: No pending jobs found. Waiting...");
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
      continue;
    }

    console.log(`Worker: Fetched ${jobs.length} pending jobs.`);

    for (const job of jobs) {
      console.log(`Worker: Starting processing for job ID: ${job.id}, Type: ${job.jobType}, Target: ${job.targetId}`);

      try {
        await db.summarizationJob.update({
          where: { id: job.id },
          data: { status: JobStatus.PROCESSING },
        });

        let summary: string | null = null;

        if (job.jobType === JobType.COMMIT_DIFF) {
          if (typeof job.payload !== 'string') {
            throw new Error(`Invalid payload type for COMMIT_DIFF: ${typeof job.payload}`);
          }
          summary = await Summarize(job.payload as string);

          if (summary) {
            const updatedCommit = await db.gitCommit.updateMany({ // updateMany in case targetId is not unique by itself
              where: {
                commitHash: job.targetId,
                gitProjectId: job.gitProjectId,
              },
              data: { summary: summary },
            });
            if (updatedCommit.count === 0) {
                console.warn(`Worker: No GitCommit found for targetId: ${job.targetId}, gitProjectId: ${job.gitProjectId}. Job ID: ${job.id}`);
                // Potentially mark job as failed or handle as a special case
                // For now, we'll let it be marked COMPLETED as summarization itself was done.
            }
            console.log(`Worker: Successfully processed COMMIT_DIFF for job ID: ${job.id}. Summary stored.`);
          } else {
            throw new Error("Summarize returned null or empty summary for COMMIT_DIFF.");
          }

        } else if (job.jobType === JobType.SOURCE_CODE) {
          if (typeof job.payload !== 'string') {
            throw new Error(`Invalid payload type for SOURCE_CODE: ${typeof job.payload}`);
          }
          const doc = {
            pageContent: job.payload as string,
            metadata: { source: job.targetId } // targetId is filePath here
          } as Document;

          summary = await SummarizeCode(doc);

          if (summary) {
            const embedding = await generateEmbedding(summary); // Generate embedding for the summary

            if (!embedding) {
                throw new Error("generateEmbedding returned null or undefined for the summary.");
            }

            // Find the SourceCodeEmbedding record first to get its ID for the raw update
            const codeEmbeddingRecord = await db.sourceCodeEmbedding.findFirst({
                where: {
                    fileName: job.targetId, // targetId is the fileName/filePath
                    gitProjectId: job.gitProjectId,
                },
            });

            if (!codeEmbeddingRecord) {
                console.warn(`Worker: No SourceCodeEmbedding found for fileName: ${job.targetId}, gitProjectId: ${job.gitProjectId}. Job ID: ${job.id}`);
                // This is a more critical issue than a missing GitCommit, as we need to store the embedding.
                // Let's throw an error to retry or mark as failed.
                throw new Error(`SourceCodeEmbedding record not found for targetId ${job.targetId} and gitProjectId ${job.gitProjectId}.`);
            }

            await db.sourceCodeEmbedding.update({
                where: { id: codeEmbeddingRecord.id },
                data: { summary: summary }
            });

            // Use $executeRaw for vector type as Prisma client might not directly support it in `update`
            // Ensure the vector format is correct for your DB (e.g., '[f1,f2,...]')
            const vectorSql = `UPDATE "SourceCodeEmbedding" SET "summaryEmbedding" = '[${embedding.join(',')}]'::vector WHERE "id" = '${codeEmbeddingRecord.id}'`;
            await db.$executeRawUnsafe(vectorSql); // Use Unsafe if column/table names are trusted & not user input

            console.log(`Worker: Successfully processed SOURCE_CODE for job ID: ${job.id}. Summary and embedding stored.`);
          } else {
            throw new Error("SummarizeCode returned null or empty summary for SOURCE_CODE.");
          }
        } else {
          throw new Error(`Unknown job type: ${job.jobType}`);
        }

        await db.summarizationJob.update({
          where: { id: job.id },
          data: {
            status: JobStatus.COMPLETED,
            errorMessage: null, // Clear any previous error message
          },
        });
        console.log(`Worker: Marked job ID ${job.id} as COMPLETED.`);

      } catch (error: any) {
        console.error(`Worker: Error processing job ID ${job.id}:`, error.message, error.stack);
        const newRetryCount = job.retryCount + 1;
        const newStatus = newRetryCount >= MAX_RETRIES ? JobStatus.FAILED : JobStatus.PENDING;

        try {
          await db.summarizationJob.update({
            where: { id: job.id },
            data: {
              status: newStatus,
              retryCount: newRetryCount,
              errorMessage: error.message || "Unknown error",
            },
          });
          console.log(`Worker: Marked job ID ${job.id} as ${newStatus}. Retry count: ${newRetryCount}.`);
        } catch (dbError) {
          console.error(`Worker: CRITICAL - Failed to update job status for job ID ${job.id} after processing error:`, dbError);
          // This job might get stuck in PROCESSING state. Manual intervention might be needed.
        }
      }
    }
  }
}

main().catch(error => {
  console.error("Worker: Unhandled error in main loop:", error);
  process.exit(1); // Exit if the main loop crashes
});
