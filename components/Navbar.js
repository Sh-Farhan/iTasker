// import React from 'react'
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar"

// const Navbar = () => {
//   return (
//     <nav className='bg-white text-black min-w-full'>
//         <div className='flex flex-row justify-between'>
//         <div className="text-2xl font-semibold items-center">
//             <span>&lt;</span>
//             Pass.io
//             <span>/&gt;</span>
//         </div>
//         <div className='flex flex-row gap-10 items-center'>
//             <ul className='flex flex-row gap-5 mr-5 text-xl font-semibold'>
//                 <li><a>Home</a></li>
//                 <li><a>About us</a></li>
//                 <li><a>Docs</a></li>
//             </ul>
//     <Avatar>
//       <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
//       <AvatarFallback>CN</AvatarFallback>
//     </Avatar>
//         </div>
//         </div>
//     </nav>
//   )
// }

// export default Navbar

import React from "react"
import { Shield, Key, Settings, User, LogOut } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex  h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <Shield className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">SecurePass</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
            <Link href="/passwords" className="text-gray-300 hover:text-white">Passwords</Link>
            <Link href="/generator" className="text-gray-300 hover:text-white">Generator</Link>
          </nav>
        </div>
        <Button variant="ghost" size="icon" className="mr-2 md:hidden">
          <Shield className="h-4 w-4 text-primary" />
          <span className="sr-only">Home</span>
        </Button>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Key className="h-4 w-4" />
              <span className="sr-only">Password Generator</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 text-white">
                <DropdownMenuItem className="hover:bg-gray-700">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="hover:bg-gray-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  )
}