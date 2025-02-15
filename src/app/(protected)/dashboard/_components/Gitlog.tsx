"use client"
import useProject from '@/hooks/use-project'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Activity, Users, GitBranch, GitCommit, GitPullRequest, GitMerge, Clock, MessageCircle, Search, ExternalLink } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { api } from "@/trpc/react"
import { format } from "date-fns"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"
import Link from 'next/link'
import { Button } from "@/components/ui/button"

const Gitlog = () => {
    const {user} = useUser()
    const {project} = useProject()
    const [searchQuery, setSearchQuery] = useState("")
    const {data: commits} = api.project.getCommits.useQuery(
      { projectId: project?.id ?? "" },
      { enabled: !!project?.id }
    )

    const filteredCommits = useMemo(() => {
        if (!commits) return []
        if (!searchQuery.trim()) return commits

        const query = searchQuery.toLowerCase()
        return commits.filter(commit => 
            commit.commitMessage.toLowerCase().includes(query) ||
            commit.commitAuthorName.toLowerCase().includes(query) ||
            commit.commitHash.toLowerCase().includes(query) ||
            commit.summary.toLowerCase().includes(query)
        )
    }, [commits, searchQuery])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">
                    {project ? project.projectName : "Select a Project"}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <p>
                        {project ? "Repository: " : "Choose a project from the sidebar to get started"}
                    </p>
                    {project && (
                        <Link 
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                            {project.repoUrl}
                            <ExternalLink className="h-3 w-3" />
                        </Link>
                    )}
                </div>
            </div>

            {project && (
                <>
                    {/* Git Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-primary/5">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
                                <GitCommit className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{commits?.length ?? 0}</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-primary/5">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
                                <Clock className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {commits && commits.length > 0 
                                        ? format(new Date(commits[0]?.commitDate ?? ''), 'MMM d')
                                        : '-'}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Commit History</CardTitle>
                                    <CardDescription>Latest changes in your repository</CardDescription>
                                </div>
                                <MessageCircle className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="mt-4 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search commits..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            {searchQuery && (
                                <div className="mt-2 text-sm text-muted-foreground">
                                    Found {filteredCommits.length} {filteredCommits.length === 1 ? 'commit' : 'commits'}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[600px] w-full pr-4">
                                {filteredCommits.length === 0 && searchQuery ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No commits found matching your search
                                    </div>
                                ) : (
                                    <Accordion type="single" collapsible className="w-full">
                                        {filteredCommits.map((commit, index) => (
                                            <AccordionItem value={commit.id} key={commit.id} className="border-b">
                                                <AccordionTrigger className="hover:no-underline">
                                                    <div className="flex items-center space-x-4 w-full">
                                                        <img 
                                                            src={commit.commitAuthorAvatarUrl} 
                                                            alt={commit.commitAuthorName}
                                                            className="h-8 w-8 rounded-full"
                                                        />
                                                        <div className="flex-1 space-y-1 text-left">
                                                            <p className="text-base font-medium">
                                                                {commit.commitMessage}
                                                            </p>
                                                            <div className="flex items-center text-sm text-muted-foreground space-x-2">
                                                                <span>{commit.commitAuthorName}</span>
                                                                <span>•</span>
                                                                <span>{format(new Date(commit.commitDate), 'MMM d, yyyy')}</span>
                                                                <span>•</span>
                                                                <Link
                                                                    href={`${project.repoUrl}/commit/${commit.commitHash}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="hover:text-primary transition-colors"
                                                                >
                                                                    <code className="px-1.5 py-0.5 bg-muted rounded text-sm inline-flex items-center gap-1">
                                                                        {commit.commitHash.slice(0, 7)}
                                                                        <ExternalLink className="h-3 w-3" />
                                                                    </code>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="pl-12 pr-4 pb-4 text-base">
                                                        <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                                                            <h4 className="text-lg font-semibold">
                                                                Commit Summary
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {commit.summary.split('\n').map((line, i) => (
                                                                    <p key={i} className="text-base leading-relaxed">
                                                                        {line}
                                                                    </p>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}

export default Gitlog