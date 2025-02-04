"use client"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { CreditCardIcon, LayoutDashboardIcon, MessageCircleIcon, SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

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
  return (
    <Sidebar collapsible='icon' variant='floating'>
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
        </SidebarContent>

    </Sidebar>
  )
}

export default SidebarLeft