// "use client"

// import React, { ReactNode, useEffect } from "react"
// import Link from "next/link"
// import {
//   Bell,
//   CheckCircle,
//   FolderKanban,
//   Home,
//   Settings,
//   Users,
//   ChevronDown,
//   LucideIcon,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { useState } from "react";
// import axios from "axios"

// type NavItemProps = {
//   href: string
//   icon: LucideIcon
//   children: ReactNode
// }

// const NavItem = ({ href, icon: Icon, children }: NavItemProps) => (
//   <Link href={href} className="flex items-center text-white no-underline mr-6">
//     <Icon className="w-5 h-5 mr-2" />
//     <span className="font-semibold">{children}</span>
//   </Link>
// )

// type DropdownItemProps = {
//   href: string
//   title: string
//   description: string
// }

// const DropdownItem = ({ href, title, description }: DropdownItemProps) => (
//   <DropdownMenuItem asChild>
//     <Link href={href} className="flex flex-col">
//       <span className="font-semibold">{title}</span>
//       <span className="text-sm text-muted-foreground">{description}</span>
//     </Link>
//   </DropdownMenuItem>
// )


// const NavBar: React.FC = () => {

//   const [username, setUserName] = useState("XYZ");

//   const getDetails = async () => {
//     try {
//       const response = await axios.post("api/users/me");
//       console.log("hello",response.data.data);
//       const {username} = response.data.data;
//       setUserName(username);
//     } catch (error) {
//       console.log(error);
//     }
//   }
// // checking
//   useEffect(() => {
//     getDetails();
//   }, [])
//   return (
//     <nav className="w-full bg-gradient-to-r from-black to-black py-3">
//       <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
//         <div className="flex items-center">
//           <NavItem href="/dashboard" icon={Home}>Dashboard</NavItem>
//           <NavItem href="/kanban" icon={CheckCircle}>Tasks</NavItem>
//           <NavItem href="/projects" icon={FolderKanban}>Projects</NavItem>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="link" className="text-white font-semibold p-0">
//                 <Users className="w-5 h-5 mr-2" />
//                 Team
//                 <ChevronDown className="w-5 h-5 ml-2" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               <DropdownItem
//                 href="/team/members"
//                 title="Members"
//                 description="View and manage team members"
//               />
//               <DropdownItem
//                 href="/team/roles"
//                 title="Roles"
//                 description="Manage team roles and permissions"
//               />
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>

//         <div className="flex items-center">
//           <Button variant="ghost" size="icon" className="text-white mr-4">
//             <Bell className="w-5 h-5" />
//           </Button>
//           <Button variant="ghost" size="icon" className="text-white mr-4">
//             <Settings className="w-5 h-5" />
//           </Button>
//           <div className="flex items-center ml-4">
//             <Avatar className="w-8 h-8 mr-2">
//               <AvatarImage
//                 src="/placeholder.svg?height=32&width=32"
//                 alt="User Avatar"
//               />
//               <AvatarFallback>AJ</AvatarFallback>
//             </Avatar>
//             <span className="text-white text-sm font-medium">
//               {username}
//             </span>
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }

// export default NavBar
"use client"

import React, { useState, useEffect, ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import axios from "axios"
import {
  Bell,
  CheckCircle,
  FolderKanban,
  Home,
  Settings,
  Users,
  ChevronDown,
  LogOut,
  Menu,
  X,
  LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type NavItemProps = {
  href: string
  icon: LucideIcon
  children: ReactNode
  isActive: boolean
  onClick?: () => void
}

const NavItem = ({ href, icon: Icon, children, isActive, onClick }: NavItemProps) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      "flex items-center text-sm font-medium transition-colors hover:text-white/80",
      isActive ? "text-white" : "text-white/60",
    )}
  >
    <Icon className="w-4 h-4 mr-2" />
    <span>{children}</span>
  </Link>
)

const NavBar: React.FC = () => {
  const [user, setUser] = useState<{ username: string; initial: string }>({
    username: "User",
    initial: "U",
  })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const getDetails = async () => {
    try {
      const response = await axios.post("/api/users/me")
      const username = response.data.data.username
      const initial = username
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
      setUser({ username, initial })
    } catch (error) {
      console.log("Failed to fetch user details:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await axios.get("/api/users/logout")
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
      router.push("/login")
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    getDetails()
  }, [])
  
  const navLinks = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/kanban", icon: CheckCircle, label: "Tasks" },
    { href: "/projects", icon: FolderKanban, label: "Projects" },
  ];

  return (
    <nav className="w-full bg-black py-3 border-b border-gray-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-lg font-bold text-white">iTasker</Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
                 <NavItem key={link.href} href={link.href} icon={link.icon} isActive={pathname === link.href}>
                    {link.label}
                </NavItem>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
            <Bell className="w-5 h-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-1 h-auto rounded-full hover:bg-white/10">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${user.username}.png`}
                    alt={user.username}
                  />
                  <AvatarFallback>{user.initial}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 px-4 pb-4 border-t border-gray-800/50">
            <div className="flex flex-col gap-4 pt-4">
                {navLinks.map(link => (
                    <NavItem 
                        key={link.href} 
                        href={link.href} 
                        icon={link.icon} 
                        isActive={pathname === link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {link.label}
                    </NavItem>
                ))}
            </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar

