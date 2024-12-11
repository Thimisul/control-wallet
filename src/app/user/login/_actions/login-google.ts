"use server"
import { signIn } from "@/services/auth/auth"

const loginGoogle = async () => {
  await signIn('google')
}

export default loginGoogle