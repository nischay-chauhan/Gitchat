import { db } from "@/server/db";
import { JobType } from "@prisma/client";

interface AddSummarizationJobParams {
  jobType: JobType;
  targetId: string;
  payload: any; // Prisma JSON can handle various serializable types
  gitProjectId: string;
}

export async function addSummarizationJob({
  jobType,
  targetId,
  payload,
  gitProjectId,
}: AddSummarizationJobParams) {
  try {
    const newJob = await db.summarizationJob.create({
      data: {
        jobType,
        targetId,
        payload,
        gitProjectId,
        // status defaults to PENDING
        // retryCount defaults to 0
      },
    });
    console.log(`[addSummarizationJob] Created new job with ID: ${newJob.id}`);
    return newJob;
  } catch (error) {
    console.error("[addSummarizationJob] Error creating summarization job:", error);
    // Depending on requirements, you might want to throw the error,
    // return null, or return a specific error object.
    // For now, re-throwing the error so the caller is aware.
    throw error;
  }
}
