"use client"
import Gitlog from './_components/Gitlog'
import QuestionPage from './_components/QuestionPage'
import useProject from '@/hooks/use-project'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

const DashBoardPage = () => {
  const { project } = useProject()

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
    <div className="space-y-6 w-full">
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-8">
        <div className="max-w-full">
          <h1 className="text-3xl font-bold mb-2">{project.projectName}</h1>
          <Link 
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-sm font-medium">Repository</span>
            <code className="px-2 py-1 bg-background/50 rounded text-sm">{project.repoUrl}</code>
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="bg-card rounded-lg shadow-sm">
          <QuestionPage />
        </div>

        <div className="bg-background rounded-lg">
          <Gitlog />
        </div>
      </div>
    </div>
  )
}

export default DashBoardPage