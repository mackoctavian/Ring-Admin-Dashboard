"use client";
import React from "react";
import ThemeProvider from "./ThemeToggle/theme-provider";
import { ClerkProvider } from '@clerk/nextjs'

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ClerkProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </ClerkProvider>
    </>
  );
}
