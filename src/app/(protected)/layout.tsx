"use client"
import { SidebarProvider } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import SidebarLeft from './_components/sidebarl'
import { motion } from 'framer-motion'

const SideBarLayout = ({children} : {children : React.ReactNode}) => {
  return (
    <SidebarProvider>
        <SidebarLeft />
        <motion.main 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='w-full m-2'
        >
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className='flex items-center gap-2 border-sidebar-border border-2 rounded-lg p-2'
            >
                {/* <Searchbar /> */}
                <div className='ml-auto'>
                </div>
                <UserButton />
            </motion.div>
            {/* main content */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className='border-sidebar-border border-2 mt-2 rounded-md overflow-auto h-[calc(100vh-6rem)] p-4'
            >
                {children}
            </motion.div>
        </motion.main>
    </SidebarProvider>
  )
}

export default SideBarLayout