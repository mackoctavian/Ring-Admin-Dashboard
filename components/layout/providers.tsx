import React from "react";
import ThemeProvider from "./ThemeToggle/theme-provider";
import { ClerkProvider} from "@clerk/nextjs";
import { SyncActiveOrganization } from "@/lib/sync-active-organization";
import { auth } from "@clerk/nextjs/server";

//TODO: Use the session context later
//import { SessionProvider } from '@/context/SessionContext';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = auth();

  return (
    <ClerkProvider>
        <SyncActiveOrganization membership={sessionClaims?.membership} />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {/* <SessionProvider> */}
            {children}
          {/* </SessionProvider> */}
        </ThemeProvider>
      </ClerkProvider>

  );
}
