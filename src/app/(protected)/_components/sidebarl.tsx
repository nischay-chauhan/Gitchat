"use client"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { CreditCardIcon, LayoutDashboardIcon, MessageCircleIcon, PlusIcon, SettingsIcon, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import useProject from '@/hooks/use-project'
import { Skeleton } from '@/components/ui/skeleton'

const items = [
    {
        title: 'Dashboard',
        icon: LayoutDashboardIcon,
        url: '/dashboard'
    },
    {
        title: 'Chats',
        icon: MessageCircleIcon,
        url: '/chats'
    },
    {
        title: 'Settings',
        icon: SettingsIcon,
        url: '/settings'
    },
    {
        title: 'Billing',
        icon: CreditCardIcon,
        url: '/billing'
    },
]

const SidebarLeft = () => {
    const pathname = usePathname()
    const { data: projects, projectId, setProjectId, isLoading } = useProject()

    return (
        <Sidebar collapsible='icon' variant='floating'>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <SidebarHeader>
                    GITCHAT
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>
                            Applications
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url} className={cn({
                                                'bg-primary text-white': pathname === item.url
                                            }, 'list-none')}>
                                                <item.icon className='w-4 h-4' />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel className="px-4 py-2">
                            Your Projects
                        </SidebarGroupLabel>
                        <SidebarGroupContent className="px-2">
                            <SidebarMenu>
                                {isLoading ? (
                                    // Loading skeletons
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <SidebarMenuItem key={i} className="mb-1">
                                            <Skeleton className="h-9 w-full rounded-md" />
                                        </SidebarMenuItem>
                                    ))
                                ) : (
                                    projects?.map((project) => (
                                        <SidebarMenuItem key={project.id} className="mb-1">
                                            <SidebarMenuButton asChild>
                                                <Button
                                                    variant={projectId === project.id ? "default" : "ghost"}
                                                    className={cn(
                                                        'flex items-center justify-between w-full gap-3 rounded-md px-4 py-2 text-sm transition-colors',
                                                        projectId === project.id ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'
                                                    )}
                                                    onClick={() => setProjectId(project.id)}
                                                >
                                                    <span>{project.projectName}</span>
                                                    <a
                                                        href={project.repoUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="opacity-50 hover:opacity-100"
                                                    >
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </Button>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))
                                )}
                                <SidebarMenuItem className="mt-4 px-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="w-full justify-start"
                                        asChild
                                    >
                                        <Link href="/create">
                                            <PlusIcon className='w-4 h-4 mr-2' />
                                            Create Project
                                        </Link>
                                    </Button>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </motion.div>
        </Sidebar>
    )
}

export default SidebarLeft