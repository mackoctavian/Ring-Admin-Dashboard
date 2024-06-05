const env = process.env.NODE_ENV
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
let debug = false

if(env == "development"){ debug = true }

const isOnboardingRoute = createRouteMatcher(["/business-registration"])
const isPublicRoute = createRouteMatcher(["/sign-in", "/sign-up", "/business-registration"])

export default clerkMiddleware((auth, req: NextRequest) => {
    const { userId, sessionClaims, redirectToSignIn } = auth();

    // For users visiting /onboarding, don't try to redirect
    if (userId && isOnboardingRoute(req)) {
      return NextResponse.next();
    }

    // If the user isn't signed in and the route is private, redirect to sign-in
    if (!userId && !isPublicRoute(req))
      return redirectToSignIn({ returnBackUrl: req.url });

    // Catch users who do not have `onboardingComplete: true` in their publicMetadata
    // Redirect them to the /onboading route to complete onboarding
    if (userId && !sessionClaims?.metadata?.onboardingComplete) {
      const onboardingUrl = new URL("/business-registration", req.url);
      return NextResponse.redirect(onboardingUrl);
    }

    // If the user is logged in and the route is protected, let them view.
    if (userId && !isPublicRoute(req)) return NextResponse.next();
  }, { debug: debug });

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};