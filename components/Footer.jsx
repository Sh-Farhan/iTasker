import React from "react"
import { Shield } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Shield className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose text-gray-300 md:text-left">
            Built by SecurePass. The source code is available on{" "}
            <Link href="#" target="_blank" rel="noreferrer" className="font-medium text-primary underline underline-offset-4">
              GitHub
            </Link>
            .
          </p>
        </div>
        <nav className="flex items-center space-x-4 text-sm font-medium">
          <Link href="/about" className="text-gray-300 hover:text-white">About</Link>
          <Link href="/privacy" className="text-gray-300 hover:text-white">Privacy</Link>
          <Link href="/terms" className="text-gray-300 hover:text-white">Terms</Link>
          <Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link>
        </nav>
      </div>
    </footer>
  )
}