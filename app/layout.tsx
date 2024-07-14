import React from "react";

export const dynamic = 'force-dynamic'

import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif, Open_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/providers";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

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
  applicationName: siteConfig.shortName,
  title: siteConfig.name,
  description: siteConfig.description,
  themeColor: "#0468F1",
  generator: "Qroo Solutions",
  openGraph: {
    type: "website",
    url: "https://www.ring.co.tz",
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.logo }],
  },
  icons: {
    icon: siteConfig.icon
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSerif.variable} ${openSans.variable}`}>
        <SpeedInsights/>
        <Analytics />
        <Providers> 
            <Toaster />
            {children}
        </Providers>
      </body>
    </html>
  );
}
