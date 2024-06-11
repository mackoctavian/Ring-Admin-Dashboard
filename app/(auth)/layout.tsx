import Image from "next/image";
import { ClerkLoaded, ClerkLoading } from '@clerk/nextjs'
import LoadingWidget from "@/components/layout/loading";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <main className="flex min-h-screen w-full justify-between font-open-sans">
        <div className="auth-asset">
          <div>
            <Image 
              src="/icons/login-security.svg"
              alt="Login"
              width={500}
              height={500}
              priority={false}
              className="rounded-l-xl object-contain"
            />
          </div>
        </div>
        <ClerkLoading>
          <LoadingWidget />
        </ClerkLoading>
        <ClerkLoaded>
          {children}
        </ClerkLoaded>
      </main>
  );
}
