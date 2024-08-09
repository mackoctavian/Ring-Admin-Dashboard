import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isDashboardRoute = createRouteMatcher([
  "/dashboard(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = auth();
  let { orgId } = auth();

  // If the route is not a dashboard route, allow access
  if (!isDashboardRoute(req)) {
    return NextResponse.next();
  }

  // Dashboard route, so check authentication
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // User is logged in, check if org id is available
  // if org id is not available, check if it's available in the session claims
  if (!orgId && sessionClaims?.membership) {
    orgId = Object.keys(sessionClaims.membership)[0];
  }

  // If url is business-registration
  if (req.nextUrl.pathname === '/business-registration') {
    // check if org id is available
    if (orgId) {
      // Org id is available so redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      // If the url is business registration and orgId is NOT available, allow access
      return NextResponse.next();
    }
  }

  if (!orgId) {
    // Org id is still missing, so redirect to business registration
    return NextResponse.redirect(new URL("/business-registration", req.url));
  }

  // All checks have passed, allow access to dashboard route
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next|api|trpc).*)",
    "/",
  ],
};