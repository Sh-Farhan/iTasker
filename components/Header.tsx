"use client"

import React from 'react'
import Link from 'next/link'
import { CheckCircle, ListTodo } from 'lucide-react'
import { Button } from "@/components/ui/button"

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 relative">
            <CheckCircle className="h-24 w-24 md:h-32 md:w-32 text-primary-foreground" />
            <ListTodo className="h-12 w-12 md:h-16 md:w-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            iTasker
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Simplify Your Day, Amplify Your Productivity
          </p>
          <Link href="/get-started" passHref legacyBehavior>
            <Button asChild size="lg" variant="secondary">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header

