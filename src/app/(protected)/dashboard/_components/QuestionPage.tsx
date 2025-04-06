"use client"
import { Button } from '@/components/ui/button'
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { motion } from 'framer-motion'
import { useState } from 'react'

const QuestionPage = () => {
    const [question, setQuestion] = useState('')

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(question)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <CardHeader className="p-4 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <div>
                        <CardTitle className="text-lg">Ask Question</CardTitle>
                        <CardDescription className="text-sm">
                            Get instant answers about your codebase
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <form onSubmit={onSubmit} className="space-y-3">
                    <Textarea 
                        placeholder="Ask a question about your codebase..." 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="min-h-[80px] resize-none text-sm"
                    />
                    <div className="flex justify-end">
                        <Button 
                            type="submit" 
                            size="sm"
                            className="px-4"
                        >
                            Ask Question
                        </Button>
                    </div>
                </form>
            </CardContent>
        </motion.div>
    )
}

export default QuestionPage