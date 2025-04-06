"use client"
import useProject from '@/hooks/use-project'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { GitCommit, Clock, MessageCircle, Search, ExternalLink } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { api } from "@/trpc/react"
import { format } from "date-fns"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"
import Link from 'next/link'

const Gitlog = () => {
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

    if (!project) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-semibold">Select a Project</h2>
                    <p className="text-muted-foreground">Choose a project from the sidebar to get started</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-primary/5 border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
                        <GitCommit className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{commits?.length ?? 0}</div>
                    </CardContent>
                </Card>

                <Card className="bg-primary/5 border-none shadow-sm">
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

            <Card className="border-none shadow-sm">
                <CardHeader className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Commit History</CardTitle>
                            <CardDescription>Latest changes in your repository</CardDescription>
                        </div>
                        <MessageCircle className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search commits..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px] pr-4">
                        <Accordion type="single" collapsible className="space-y-4">
                            {filteredCommits.map((commit) => (
                                <AccordionItem 
                                    key={commit.id} 
                                    value={commit.id}
                                    className="border bg-white/50 rounded-lg px-4"
                                >
                                    <AccordionTrigger className="hover:no-underline py-4">
                                        <div className="flex items-center space-x-4 w-full">
                                            <img 
                                                src={commit.commitAuthorAvatarUrl} 
                                                alt={commit.commitAuthorName}
                                                className="h-10 w-10 rounded-full"
                                            />
                                            <div className="flex-1 space-y-1 text-left">
                                                <p className="font-medium line-clamp-1">
                                                    {commit.commitMessage}
                                                </p>
                                                <div className="flex items-center text-sm text-muted-foreground space-x-2">
                                                    <span>{commit.commitAuthorName}</span>
                                                    <span>•</span>
                                                    <span>{format(new Date(commit.commitDate), 'MMM d, yyyy')}</span>
                                                    <span>•</span>
                                                    <code className="px-2 py-0.5 bg-muted rounded text-xs">
                                                        {commit.commitHash.slice(0, 7)}
                                                    </code>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-4">
                                        <div className="bg-muted/30 rounded-lg p-4 mt-2">
                                            <h4 className="text-sm font-medium mb-2">Commit Summary</h4>
                                            <div className="prose prose-sm max-w-none">
                                                {commit.summary.split('\n').map((line, i) => (
                                                    <p key={i} className="text-muted-foreground">
                                                        {line}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}

export default Gitlog