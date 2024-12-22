import authConfig from "@/services/auth/auth.config"
import NextAuth from "next-auth"
import { NextRequest } from "next/server"
 
const { auth } = NextAuth(authConfig)
export default auth(async function middleware(req: NextRequest & { auth: any }) {
    if (!req.auth && req.nextUrl.pathname !== "/auth") {
    const newUrl = new URL("/auth", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }})

  export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  }