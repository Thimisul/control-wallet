'use server';
import { auth } from "@/services/auth/auth";
import { EditUserSchema } from "../_schemas/user";
import { ZodIssue } from "zod";
import { Prisma, User } from "@prisma/client";
import { getAllUsers, updateUserById, UserGetPayloadType } from "@/data/user";
import { revalidatePath } from "next/cache";


export default async function userAction(_prevState: any, formData: FormData): Promise<{ errors: ZodIssue[], message: string }> {
    revalidatePath("/app/user");
    const session = await auth()

    const validation = EditUserSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        image: formData.get("image"),
    });

    if (validation.success) {
        const res = await updateUserById(session?.user?.id, validation.data as Prisma.UserUpdateInput)
        if (res) {
            return {
                message: "User created",
                errors: [],
            }
        }

    } else {
        return {
            message: "Error",
            errors: validation.error.issues,
        };
    }

    return {
        message: "Error",
        errors: [],
    };

}

export async function getAllUsersAction(): Promise<{ data: UserGetPayloadType[], messageError?: string }> {
    const data = await getAllUsers({})
    return data
}