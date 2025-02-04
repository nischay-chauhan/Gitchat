import { SidebarProvider } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import SidebarLeft from './_components/sidebarl'


const SideBarLayout = ({children} : {children : React.ReactNode}) => {
  return (
    <SidebarProvider>
        <SidebarLeft />
        <main className='w-full m-2'>
            <div className='flex items-center gap-2 border-sidebar-border border-2 rounded-lg p-2'>
                {/* <Searchbar /> */}
                <div className='ml-auto'>
                </div>
                <UserButton />
            </div>
            {/* main content */}
            <div className='border-sidebar-border border-2 mt-2 rounded-md overflow-auto h-[calc(100vh-6rem)] p-4'>
                {children}
            </div>
        </main>
    </SidebarProvider>
  )
}

export default SideBarLayout