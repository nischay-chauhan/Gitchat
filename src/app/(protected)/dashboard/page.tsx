"use client"
import useProject from '@/hooks/use-project'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Activity, Users, GitBranch, GitCommit, GitPullRequest, GitMerge, Clock } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const DashBoardPage = () => {
    const {user} = useUser()
    const {project} = useProject()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {project ? project.projectName : "Select a Project"}
        </h1>
        <h3>
        {project?.id}
        </h3>
        <p className="text-muted-foreground">
          {project ? `Repository: ${project.repoUrl}` : "Choose a project from the sidebar to get started"}
        </p>
      </div>

      
    </div>
  )
}

export default DashBoardPage