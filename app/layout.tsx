import React from "react";

export const dynamic = 'force-dynamic'

import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif, Open_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/providers";
import { Toaster } from "@/components/ui/toaster";
import { cookies } from "next/headers";
import { siteConfig } from "@/config/site"

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-serif'
});
const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-open-sans'
})

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: siteConfig.logo
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = cookies().get("qroo-pos-session");

  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSerif.variable} ${openSans.variable}`}>
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
