import { SignUp } from "@clerk/nextjs";
import Image from 'next/image'
import Link from 'next/link'
import { siteConfig } from "@/config/site"
import { Suspense } from "react";
import LoadingWidget from "@/components/layout/loading";

const SignUpPage = async () => {
  return (
    <section className="flex-center size-full max-sm:px-6">
      <section className="auth-form">
        <header className='flex flex-col gap-5 md:gap-8'>
          <Link href="/" className="cursor-pointer flex items-center gap-1">
            <Image
              src="/icons/logo.svg"
              width={34}
              height={34}
              alt={siteConfig.name}
            />
            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">{siteConfig.name}</h1>
          </Link>
        </header>
        <Suspense fallback={<LoadingWidget />}>
          <SignUp />
        </Suspense>
      </section>
    </section>
  )
}

export default SignUpPage