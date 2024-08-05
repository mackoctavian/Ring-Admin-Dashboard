import Image from "next/image";
import { ClerkLoaded, ClerkLoading } from '@clerk/nextjs'
import LoadingWidget from "@/components/layout/loading";
import NavBar from "@/components/landing/NavBar";
import type {Metadata} from "next";
import {siteConfig} from "@/config/site";

export const metadata: Metadata = {
    applicationName: siteConfig.shortName,
    title: siteConfig.name,
    description: siteConfig.description,
    generator: "Qroo Solutions",
    openGraph: {
        type: "website",
        url: "https://www.ring.co.tz",
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
        images: [{ url: siteConfig.links.baseUrl+siteConfig.logo }],
    },
    icons: {
        icon: siteConfig.icon
    }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <main className="flex min-h-screen w-full justify-between font-open-sans">
          <NavBar/>
          <div className="auth-asset flex items-center justify-center">
              <Image
                  src="/icons/login-security.svg"
                  alt="Ring authentication"
                  width={500}
                  height={500}
                  priority={false}
                  className="rounded-l-xl mx-auto"
              />
          </div>
          <ClerkLoading>
              <LoadingWidget/>
          </ClerkLoading>
          <ClerkLoaded>
              {children}
          </ClerkLoaded>
      </main>
  );
}
