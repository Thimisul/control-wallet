import { Button } from "@/components/ui/button"
import { Chrome } from "lucide-react"
import loginGoogle from "../_actions/login-google"

const GoogleLoginForm = () => {
    return (
        <form action={loginGoogle}>
            <Button variant="outline" className="w-full">
                <Chrome className="h-5 w-5 mr-4" />
                Entrar com Google
            </Button>
        </form>
    )
}
export default GoogleLoginForm  