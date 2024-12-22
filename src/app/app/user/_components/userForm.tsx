// app/contact/form.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@prisma/client";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useActionState, useState } from "react";
import { useFormState } from "react-dom";
import type { ZodIssue } from "zod";

type UserProps = {
  user?: Partial<User>,
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<{ errors: ZodIssue[], message: string }>;
};



export default function UserForm({ user,action }: UserProps) {
  const [state, formAction] = useActionState(action, { errors: [], message: "" });
  
  const nameErrors = findErrors("name", state.errors);
  const emailErrors = findErrors("email", state.errors);


  return (
    <form action={formAction}>
      <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Update Profile</CardTitle>
        <CardDescription>Edit your personal information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Enter your name" defaultValue={user?.name ? user.name: '' } />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="Enter your email" type="email" defaultValue={user?.email ? user.email: '' } />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-picture">Profile Picture</Label>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage className="overflow-hidden rounded-full" src={user?.image ? user.image : '/placeholder-user.jpg'} />
              <AvatarFallback>{user?.name?.charAt(0) ?? 'U'}</AvatarFallback>
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
    </form>
  );
}

const ErrorMessages = ({ errors }: { errors: string[] }) => {
  if (errors.length === 0) return null;

  const text = errors.join(", ");

  return <div className="text-red-600 peer">{text}</div>;
};

const findErrors = (fieldName: string, errors: ZodIssue[]) => {
  return errors
    .filter((item) => {
      return item.path.includes(fieldName);
    })
    .map((item) => item.message);
};


