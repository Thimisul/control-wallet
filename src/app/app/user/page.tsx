'use server';

import userAction from "./_actions";
import UserForm from "./_components/userForm";
import { auth } from "@/services/auth/auth";

export default async function UserPage() {
  const session = await auth()
  return (
      <UserForm user={session?.user} action={userAction}></UserForm>
  );
}