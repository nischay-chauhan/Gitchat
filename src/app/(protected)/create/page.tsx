"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { motion } from "framer-motion"
import {useForm} from "react-hook-form"

type FormInput = {
    repoUrl : string
    projectName : string
    githubToken ?: string
}

const CreatePage = () => {
    const { register, handleSubmit, reset } = useForm<FormInput>()
    
    const onSubmit = (data: FormInput) => {
        console.log(data) // Handle form submission here
    }

    return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center h-full max-w-md mx-auto p-6"
        >
          <div className="w-full space-y-8">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center space-y-4"
            >
              <Image 
                src="/create.svg" 
                alt="Create Project" 
                width={250} 
                height={250}
                className="mx-auto"
              />
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold tracking-tight"
              >
                Start Your AI-Powered Code Journey
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-muted-foreground"
              >
                Connect your GitHub repository and let GitChat transform your development workflow with intelligent code insights.
              </motion.p>
            </motion.div>

            {/* Form Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2 mb-4"
                >
                  <Input
                    {...register("projectName", { required: true })}
                    placeholder="Project Name"
                    type="text"
                  />
                </motion.div>
                
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-2 mb-4"
                >
                  <Input
                    {...register("repoUrl", { required: true })}
                    placeholder="GitHub Repository URL"
                    type="url"
                  />
                </motion.div>
                
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-2 mb-6"
                >
                  <Input
                    {...register("githubToken")}
                    placeholder="GitHub Token (optional, for private repositories)"
                    type="password"
                  />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <Button type="submit" className="w-full" size="lg">
                    Check Credits →
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </motion.div>
    )
}

export default CreatePage