"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Github, MessageSquare, GitCommit, Upload, GithubIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useUser, UserButton } from '@clerk/nextjs'

export default function HomePage() {
  const { isSignedIn, user } = useUser()
  const [repoUrl, setRepoUrl] = useState("")

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <header className="container mx-auto py-6">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <GithubIcon className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">GitChat</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            {isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" className="mr-2">
                    Dashboard
                  </Button>
                </Link>
                <Button className="flex items-center">
                  <UserButton />
                </Button>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="outline" className="mr-2">
                    Login
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto py-20 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Chat with Your GitHub Repository
            </h1>
            <p className="text-xl mb-10 text-gray-600 dark:text-gray-300">
              Upload your GitHub URL, get AI-generated commit summaries, and have intelligent conversations about your
              codebase.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <Input
                placeholder="Paste your GitHub repository URL"
                className="flex-1"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
              />
              <Button className="gap-2">
                <span>Analyze Repo</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </section>

        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-16"
            >
              Powerful Features
            </motion.h2>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              <motion.div variants={item}>
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <Upload className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Easy Repository Upload</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Simply paste your GitHub URL and let GitChat analyze your repository in seconds.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-pink-100 dark:bg-pink-900 p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <GitCommit className="h-6 w-6 text-pink-600 dark:text-pink-300" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">AI Commit Summaries</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Get intelligent summaries of your commit history, making it easier to understand project
                      evolution.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Chat With Your Code</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Ask questions about your codebase and get intelligent answers based on your project context.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        <section className="py-20 container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-16"
          >
            How It Works
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <img src="/placeholder.svg?height=400&width=600" alt="GitChat Demo" className="w-full h-auto" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <ol className="space-y-8">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Paste Your GitHub URL</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Enter your repository URL in the input field and click "Analyze Repo".
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Review Commit Summaries</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      GitChat analyzes your commit history and generates intelligent summaries.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Chat With Your Repository</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Ask questions about your code, get explanations, and receive suggestions for improvements.
                    </p>
                  </div>
                </li>
              </ol>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to understand your codebase better?</h2>
              <p className="text-xl mb-8 text-white/80">
                Start chatting with your GitHub repository today and unlock insights you never knew existed.
              </p>
              <Button size="lg" variant="secondary" className="gap-2">
                <span>Get Started for Free</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Github className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">GitChat</span>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-600 hover:text-primary dark:text-gray-300">
                About
              </Link>
              <Link href="#" className="text-gray-600 hover:text-primary dark:text-gray-300">
                Features
              </Link>
              <Link href="#" className="text-gray-600 hover:text-primary dark:text-gray-300">
                Pricing
              </Link>
              <Link href="#" className="text-gray-600 hover:text-primary dark:text-gray-300">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} GitChat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

