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
  "/sign-in(.*)",
  "/sign-up(.*)",
 // "/business-registration(.*)",
  "/_not-found(.*)",
  "/not-found(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = auth();
  let { orgId } = auth();

//  console.log("USER ID", userId);
//  console.log("ORG ID", orgId);
//  console.log("SESSION DATA", sessionClaims);

  // If url is public, allow access
  if ( isPublicRoute(req) ){
//    console.log("public route")
    return NextResponse.next()
  }else{
    //Not a public route so check authentication
//    console.log("NOT a public route")
    if (!userId) {
//      console.log("NOT LOGGED IN")
      return redirectToSignIn({ returnBackUrl: req.url });
    }else{
      console.log("LOGGED IN")
      //User is logged in,
      //check if org id is available
      //if org id is not available, check if its available in the session sessionClaims
      if (!orgId && sessionClaims?.membership) {
//        console.log("FETCH ORG ID IN CLAIMS")
        orgId = Object.keys(sessionClaims.membership)[0];
      }

      //If url is business-registration
      if ( req.url.includes('/business-registration') ){
        //check if org id is available
        if( orgId ){
          // Org id is available so redirect me home
//          console.log("LOGGED IN, AND ORG ID AVAILABLE, GO HOME")
          return NextResponse.redirect(new URL("/", req.url));
        }else{
//          console.log("BUSINESS REG ALLOWED SINCE ORG ID MISSING")
          //If the url is business registration and orgId is NOT available, allow access
          return NextResponse.next();
        }
      }else{
        if ( !orgId ){
          //Org id is still missing, so redirect me to business registration
//          console.log("ORG ID IS STILL MISSING, REDIRECT TO BUSINESS REG")
          return NextResponse.redirect(new URL("business-registration", req.url));
        }else{
          //Url is not business-registration and all other checks have passed, allow access
//          console.log("EVERYTHING PASSED, ALLOW ACCESS")
          return NextResponse.next();
        }

      }

    }

  }
}, { debug: debugState });

export const config = {
  matcher: [
    "/((?!.*\\..*|_next|api|trpc).*)", // Exclude static files, _next, api, and trpc routes
    "/",
  ],
};
