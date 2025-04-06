import { IndexGithubRepo } from "@/lib/github";
import { pullCommits } from "@/lib/ocktokit";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const projectRouter = createTRPCRouter({
   createProject : protectedProcedure.input(z.object({
    projectName : z.string(),
    repoUrl : z.string(),
    githubToken : z.string().optional()
   })).mutation(async ({ctx , input}) => {
    const {projectName , repoUrl , githubToken} = input

    const existingProjectName = await ctx.db.gitProject.findFirst({
      where: {
        projectName,
        userId: ctx.user.userId!,
        deletedAt: null
      }
    });

    if (existingProjectName) {
      throw new Error("A project with this name already exists");
    }

    const existingProjectUrl = await ctx.db.gitProject.findFirst({
      where: {
        repoUrl,
        userId: ctx.user.userId!,
        deletedAt: null
      }
    });

    if (existingProjectUrl) {
      throw new Error("This repository is already linked to another project");
    }

    const project = await ctx.db.gitProject.create({
       data : {
        projectName : projectName ,
        repoUrl : repoUrl ,
        githubToken : githubToken ,
        userId : ctx.user.userId!
       }
    })
    await IndexGithubRepo(project.id , repoUrl , githubToken)
    await pullCommits(project.id)
    return project
   }),
   
   getProjects : protectedProcedure.query(async ({ctx}) => {
    const projects = await ctx.db.gitProject.findMany({where : {userId : ctx.user.userId! , deletedAt : null}})
    return projects
   }),
   getCommits: protectedProcedure
    .input(z.object({
        projectId: z.string()
    }))
    .query(async ({ctx, input}) => {
      await pullCommits(input.projectId).catch(err => {
        console.error(err)
      })
        const commits = await ctx.db.gitCommit.findMany({
            where: {
                gitProjectId: input.projectId
            },
            orderBy: {
                commitDate: 'desc'
            }
        })
        return commits
    }),
})