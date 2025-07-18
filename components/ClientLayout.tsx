// components/ClientLayout.tsx
"use client";

import React from "react";
import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
      <Toaster />
    </>
  );
}
