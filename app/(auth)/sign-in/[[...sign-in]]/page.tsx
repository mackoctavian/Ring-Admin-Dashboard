import { SignIn } from "@clerk/nextjs";
import Image from 'next/image'
import Link from 'next/link'
import { siteConfig } from "@/config/site"
import { Suspense } from "react";
import LoadingWidget from "@/components/layout/loading";

const SignInPage = () => {
  return (
    <section className="flex-center size-full max-sm:px-6">
      <section className="auth-form">
        <Suspense fallback={<LoadingWidget />}>
          <SignIn />
        </Suspense>
      </section>
    </section>
  )
}

export default SignInPage