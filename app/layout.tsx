export const dynamic = 'force-dynamic'

import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif, Open_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-serif'
});
const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--open-sans'
})

export const metadata: Metadata = {
  title: "Slide POS",
  description: "Modern business solutions for small scale enterprises.",
  icons: {
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSerif.variable} ${openSans.variable}`}>{children}</body>
    </html>
  );
}
