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
        <p className="text-muted-foreground">
          {project ? `Repository: ${project.repoUrl}` : "Choose a project from the sidebar to get started"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">
              +4 since last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contributors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              +2 new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pull Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              3 pending review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Code Changes</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2.4k</div>
            <p className="text-xs text-muted-foreground">
              Lines changed this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCommit className="h-5 w-5" />
              Recent Commits
            </CardTitle>
            <CardDescription>Latest changes to the repository</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {[
                  {
                    message: "Update authentication flow",
                    author: "Sarah Chen",
                    time: "2 hours ago",
                    hash: "a1b2c3d"
                  },
                  {
                    message: "Fix responsive layout issues",
                    author: "Mike Wilson",
                    time: "5 hours ago",
                    hash: "e4f5g6h"
                  },
                  {
                    message: "Add new API endpoints",
                    author: "Alex Kumar",
                    time: "yesterday",
                    hash: "i7j8k9l"
                  },
                ].map((commit, i) => (
                  <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0">
                    <div className="rounded-full bg-primary/10 p-2">
                      <GitCommit className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{commit.message}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{commit.author}</span>
                        <span>•</span>
                        <code className="text-xs">{commit.hash}</code>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {commit.time}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitPullRequest className="h-5 w-5" />
              Pull Request Status
            </CardTitle>
            <CardDescription>Active pull requests and reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {[
                  {
                    title: "Feature: User Authentication",
                    author: "David Kim",
                    status: "In Review",
                    reviewers: ["Sarah C.", "Mike W."],
                    number: "#123"
                  },
                  {
                    title: "Fix: Database Migration",
                    author: "Emma Thompson",
                    status: "Changes Requested",
                    reviewers: ["Alex K."],
                    number: "#122"
                  },
                  {
                    title: "Update: Documentation",
                    author: "Chris Lee",
                    status: "Approved",
                    reviewers: ["David K.", "Emma T."],
                    number: "#121"
                  }
                ].map((pr, i) => (
                  <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0">
                    <div className={cn(
                      "rounded-full p-2",
                      {
                        "bg-yellow-500/10": pr.status === "In Review",
                        "bg-red-500/10": pr.status === "Changes Requested",
                        "bg-green-500/10": pr.status === "Approved"
                      }
                    )}>
                      <GitPullRequest className={cn(
                        "h-4 w-4",
                        {
                          "text-yellow-500": pr.status === "In Review",
                          "text-red-500": pr.status === "Changes Requested",
                          "text-green-500": pr.status === "Approved"
                        }
                      )} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{pr.title}</p>
                        <span className="text-xs text-muted-foreground">{pr.number}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{pr.author}</span>
                        <span>•</span>
                        <span>{pr.status}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {pr.reviewers.join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Branch Activity
            </CardTitle>
            <CardDescription>Recent branch updates and merges</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {[
                  {
                    type: "created",
                    branch: "feature/user-auth",
                    author: "Sarah Chen",
                    time: "1 hour ago"
                  },
                  {
                    type: "merged",
                    branch: "fix/api-endpoint",
                    author: "Mike Wilson",
                    time: "3 hours ago"
                  },
                  {
                    type: "deleted",
                    branch: "temp/testing",
                    author: "Alex Kumar",
                    time: "5 hours ago"
                  }
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0">
                    <div className="rounded-full bg-primary/10 p-2">
                      {activity.type === "merged" ? (
                        <GitMerge className="h-4 w-4" />
                      ) : (
                        <GitBranch className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        {activity.type === "created" && "New branch created"}
                        {activity.type === "merged" && "Branch merged"}
                        {activity.type === "deleted" && "Branch deleted"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <code className="text-xs">{activity.branch}</code>
                        <span>•</span>
                        <span>{activity.author}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashBoardPage