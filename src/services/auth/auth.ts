import NextAuth from "next-auth"
import authConfig from "@/services/auth/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/services/database"



export const { handlers, auth, signIn, signOut } = NextAuth(
  {
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
  }
)