'use server'

import { saltAndHashPassword } from "@/lib/password"
import { signIn } from "@/services/auth/auth"
import { prisma } from "@/services/database"
import { redirect } from 'next/navigation'

const login = async (formData: FormData) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const hashedPassword = await saltAndHashPassword(password)
  const user = await prisma.user.findFirst({
    where: {
      email: email,
      password: hashedPassword,
    }
  })
  return user
}

const loginCredentials = async (formData: FormData) => {
    const user = await signIn("credentials", formData)
    
}


export { login, loginCredentials }