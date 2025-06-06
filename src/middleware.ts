import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/", "/login", "/signup", "/favicon.ico", "/_next/(.*)", "/static/(.*)", "/images/(.*)", "/fonts/(.*)", "/manifest.json"
]);
/* "/api/(.*)", */

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    if ((await auth()).userId && ["/login", "/signup", "/"].includes(req.nextUrl.pathname)) {
      return Response.redirect(new URL("/dashboard", req.url));
    }
    return;
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|fonts|manifest.json).*)",
    "/api/(.*)"
  ],
};
