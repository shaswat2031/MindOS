import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/', 
  '/about', 
  '/terms', 
  '/privacy', 
  '/blog', 
  '/blog(.*)', 
  '/family-council/(.*)', // Allowing all family-council subroutes for now as they have internal checks
  '/api/family-council/public/(.*)',
  '/api/family-council/submit'
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    // For API routes, we don't want to redirect to sign-in page.
    // We let the request pass to the route handler which handles its own 401 response.
    if (request.nextUrl.pathname.startsWith('/api')) {
      return;
    }
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
