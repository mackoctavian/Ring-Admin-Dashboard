"use client";
import React from "react";
import ThemeProvider from "./ThemeToggle/theme-provider";
import { ClerkProvider } from '@clerk/nextjs'
import { SessionProvider } from '@/context/SessionContext';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ClerkProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SessionProvider>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </ClerkProvider>
    </>
  );
}
