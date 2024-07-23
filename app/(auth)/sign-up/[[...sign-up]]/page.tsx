import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";
import LoadingWidget from "@/components/layout/loading";

const SignUpPage = async () => {
  return (
    <section className="flex-center size-full max-sm:px-6">
      <section className="auth-form">
        <Suspense fallback={<LoadingWidget />}>
          <SignUp />
        </Suspense>
      </section>
    </section>
  )
}

export default SignUpPage