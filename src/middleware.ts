import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('authjs.session-token')
    console.log(request.url)
    if (request.nextUrl.pathname.startsWith('/user/login') && token) {
        return NextResponse.redirect(new URL('/app/user', request.url))
    }
    
    if (request.nextUrl.pathname.startsWith('/app') && !token) {
        return NextResponse.redirect(new URL('/user/login', request.url))
    }
}

export const config = {
    matcher: [
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
  }