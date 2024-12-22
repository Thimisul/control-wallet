import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function CreateForm() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle>Update Profile</CardTitle>
        <CardDescription>Edit your personal information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter your name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="Enter your email" type="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="Enter your password" type="password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-picture">Profile Picture</Label>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <Input id="profile-picture" type="file" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="ml-auto">
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  )
}