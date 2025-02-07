"use client"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { CreditCardIcon, LayoutDashboardIcon, MessageCircleIcon, PlusIcon, SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import useProject from '@/hooks/use-project'

const items = [
    {
        title: 'Dashboard',
        icon: LayoutDashboardIcon,
        url: '/dashboard'
    },
    {
        title : 'Chats',
        icon : MessageCircleIcon,
        url : '/chats'
    },
    {
        title : 'Settings',
        icon : SettingsIcon,
        url : '/settings'
    },
    {
        title : 'Billing',
        icon : CreditCardIcon,
        url : '/billing'
    },
]

const SidebarLeft = () => {
    const pathname = usePathname()

const { data: projects, projectId, setProjectId } = useProject()

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
                            {items.map((iten) => {
                                return(
                                    <SidebarMenuItem key={iten.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={iten.url} className={cn({
                                                'bg-primary text-white' : pathname === iten.url
                                            }, 'list-none')}>
                                                <iten.icon className='w-4 h-4' />
                                                <span>{iten.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel className="px-4 py-2">
                            Your Projects
                        </SidebarGroupLabel>
                        <SidebarGroupContent className="px-2">
                            <SidebarMenu>
                                {projects?.map((project) => (
                                    <SidebarMenuItem key={project.id} className="mb-1">
                                        <SidebarMenuButton asChild>
                                            <Link 
                                                href={`/projects/${project.projectName.toLowerCase().replace(' ', '-')}`} 
                                                className={cn('flex items-center gap-3 rounded-md px-4 py-2 text-sm transition-colors hover:bg-primary/10', {
                                                    'bg-primary text-white': pathname.includes(project.projectName.toLowerCase().replace(' ', '-')) || projectId === project.id
                                                })}
                                                onClick={() => setProjectId(project.id)}
                                            >
                                                <span>{project.projectName}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
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