//Next
import Link from "next/link"
//SchdcnUI
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
//Login Components
import GoogleLoginForm from "./_components/button-google-login"
import EmailPasswordLoginForm from "./_components/email-password-login-form"

const LoginPage = () => {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Entre com seu email abaixo para fazer login na sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EmailPasswordLoginForm />
        <GoogleLoginForm />
        <div className="mt-4 text-center text-sm">
          Não tem uma conta?{" "}
          <Link href="#" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default LoginPage