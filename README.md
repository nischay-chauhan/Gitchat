# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## Queue System Setup and Usage

This project includes a background job queue system to handle asynchronous tasks like code and commit summarization. Proper setup is crucial for these features to work.

### 1. Database Migration

The queue system introduces a new database table (`SummarizationJob`) and associated enums (`JobType`, `JobStatus`). These changes need to be applied to your database schema via a Prisma migration.

**Important:** If you are setting up the project manually or if the automated setup skipped database migrations (e.g., due to Docker environment constraints not starting the DB initially), you **must** run this migration.

Execute the following command in your terminal:

```bash
npx prisma migrate dev --name add_summarization_job_table
```

This command applies the pending migration that creates the necessary table and enums for the summarization job queue.

### 2. Running the Summarization Worker

A background worker process is responsible for picking up pending summarization jobs from the queue and executing them. This worker is located at `src/workers/summarizationWorker.ts`.

To run the worker, you can use `bun` (as a `bun.lock` file is present in the project, indicating `bun` as the package manager):

```bash
bun run src/workers/summarizationWorker.ts
```

Alternatively, if you have `ts-node` installed, you could use:
```bash
npx ts-node src/workers/summarizationWorker.ts
```

For the application's summarization features to function correctly, **this worker must be running continuously in the background.**

For production environments, it's highly recommended to use a process manager like PM2, systemd, or containerize the worker (e.g., using Docker) to ensure it runs reliably and restarts if it crashes.

### 3. Environment Variables

The summarization worker, along with other parts of the application, relies on specific environment variables being set. Ensure these are correctly configured in your `.env` file:

*   `DATABASE_URL`: Connection string for your PostgreSQL database. The worker needs this to read jobs and write results.
*   `GEMINI_API_KEY`: API key for Google Gemini, used for generating summaries.
*   `GITHUB_TOKEN` (Optional but Recommended): GitHub token for fetching repository data, including commit diffs, more reliably and with higher rate limits.

Please refer to the `.env.example` file for a comprehensive list of all environment variables required by the application. Ensure your `.env` file is populated with the correct values.
