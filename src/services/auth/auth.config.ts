import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google";

export default {
    providers: [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    callbacks: {
      authorized({ auth, request: { nextUrl } }) {
        const isLoggedIn = !!auth?.user;
        // const paths = ["/profile", "/client-side"];
        const paths = ["/app"];
        const isProtected = paths.some((path) =>
          nextUrl.pathname.startsWith(path)
        );
  
        if (isProtected && !isLoggedIn) {
          const redirectUrl = new URL("/api/auth/signin", nextUrl.origin);
          redirectUrl.searchParams.append("callbackUrl", nextUrl.href);
          return Response.redirect(redirectUrl);
        }
        return true;
      },
      jwt: ({ token, user }) => {
        if (user) {
          const u = user as unknown as any;
          return {
            ...token,
            id: u.id,
            randomKey: u.randomKey,
          };
        }
        return token;
      },
      session(params) {
        return {
          ...params.session,
          user: {
            ...params.session.user,
            id: params.token.id as string,
            randomKey: params.token.randomKey,
          },
        };
      },
    },
    pages: {
      signIn: '/auth',
      error: '/auth/error',
      signOut: '/auth/signout',
      verifyRequest: '/auth/verify-request',
      newUser: '/auth/new-user'
    },
    debug: process.env.NODE_ENV === 'development',
  } satisfies NextAuthConfig