import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import {login, loginCredentials} from "../_actions/login"
 
const EmailPasswordLoginForm  = () => {
  return (
 <form action={loginCredentials} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Esqueceu sua senha?
              </Link>
            </div>
            <Input id="password"  type="password" name="password"  required />
          </div>
          <Button type="submit" className="ml-auto">
            Sign In
          </Button>
        </form>
  )
}

export default EmailPasswordLoginForm