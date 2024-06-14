import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SignedIn>        
          {children}
      </SignedIn>
      <SignedOut>
          <RedirectToSignIn />
      </SignedOut>
    </>
  )
}