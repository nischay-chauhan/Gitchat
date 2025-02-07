"use client"

import { api } from "@/trpc/react"
import { useLocalStorage } from "usehooks-ts"

const useProject = () => {
    const { data, isLoading } = api.project.getProjects.useQuery(undefined, {
        refetchOnWindowFocus: false
    })
    
    const [projectId, setProjectId] = useLocalStorage("projectId", "")
    const project = data?.find((project) => project.id === projectId)

    return { 
        data, 
        project, 
        projectId, 
        setProjectId,
        isLoading 
    }
}

export default useProject