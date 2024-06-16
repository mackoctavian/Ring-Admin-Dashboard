const env = process.env.NODE_ENV
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

let debugState = false

//TODO: Enable debug option
//process.env.NODE_ENV === "development";
//if(env == "development"){ debugState = true }


const isOnboardingRoute = createRouteMatcher(["/business-registration"]);
const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/sign-up/verify-email-address",
  "/business-registration",
  "/_not-found",
  "/not-found"
]);


export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = auth();
  let { orgId } = auth();

  // Extract the first key from the membership object if orgId is not already set
  if (!orgId && sessionClaims?.membership) {
    orgId = Object.keys(sessionClaims.membership)[0];
  }

//  console.log("USER ID", userId);
//  console.log("ORG ID", orgId);
//  console.log("SESSIONDATA", sessionClaims);

  if (!userId && !isPublicRoute(req)) {
    // If the user isn't signed in and the route is private, redirect to sign-in
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  if (userId) {
    // If userId but no orgId, redirect to business registration unless already on business-registration route
    if (!orgId) {
      if (!req.url.includes('/business-registration')) {
        return NextResponse.redirect(new URL("/business-registration", req.url));
      }
      return NextResponse.next();
    }

    // Handle the scenario where onboarding is complete but no organization id
    if (!orgId && sessionClaims?.metadata?.onboardingComplete) {
      return redirectToSignIn();
    }

    // User is registered and is already tied to an organization and onboarding is complete
    if (orgId && sessionClaims?.metadata?.onboardingComplete) {
      if (isOnboardingRoute(req)) {
        // If onboarding is complete and user is on the onboarding route, redirect to home
        return NextResponse.redirect(new URL("/", req.url));
      }
      // Allow the request to proceed for signed-in users on other routes
      return NextResponse.next();
    }

    // If userId and orgId but onboarding not complete
    if (orgId && !sessionClaims?.metadata?.onboardingComplete) {
      if (!req.url.includes('/business-registration')) {
        // Update onboardingComplete to true using Clerk client
        await clerkClient.users.updateUser(userId, {
          publicMetadata: {
            onboardingComplete: true,
          },
          privateMetadata: {
            onboardingComplete: true,
          },
        });
        // Redirect to home page
        return NextResponse.redirect(new URL("/", req.url));
      }
      // Allow the request to proceed if already on the business-registration route
      return NextResponse.next();
    }
  }

  // For public routes and other cases, continue to the next middleware
  return NextResponse.next();
}, { debug: debugState });


export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};