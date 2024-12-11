import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/services/database"
import Credentials from "next-auth/providers/credentials"
import { saltAndHashPassword, verifyPassword } from "@/lib/password"
import { getUserEmailPassword } from "@/functions/users"
import Google from "next-auth/providers/google"



export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Credentials({
    type: 'credentials',
    credentials: {
      email: {},
      password: {},
    },
    authorize: async (credentials) => {
      let user = null
      user = await getUserEmailPassword(credentials.email, credentials.password)
      if (!user) {
        throw new Error("User not found.")
      }
      return user
    },
  }), Google],
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.id = user.id
      }
      console.log('id')
      console.log(token)
      return token
    },
    session({ session, user }) {
      session.user.id = user.id
      console.log(user.id)
      return session
    },
  },
  pages: {
    error: '/auth',
    signIn: '/app/user',
    signOut: '/auth',
    verifyRequest: '/auth/user',
    newUser: '/app/user'
  },
})