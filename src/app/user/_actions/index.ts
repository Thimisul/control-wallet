'use server';
import { auth } from "@/services/auth/auth";
import { EditUserSchema } from "../_schemas/user";
import { ZodIssue } from "zod";
import { User } from "@prisma/client";
import { getAllUsers, UserGetPayloadType } from "@/data/user";


export default async function userAction(_prevState: any, params: FormData): Promise<{ errors: ZodIssue[], message: string }> { 
    
    const validation = EditUserSchema.safeParse({
        name: params.get("name"),
        email: params.get("email"),
        password: params.get("password"),
        image: params.get("image"),
    });

    if (validation.success) {
        let res
        if(true){
        res = await fetch("http://localhost:3000/api/v1/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(validation.data),
        })
    }else {
        res = await fetch("http://localhost:3000/api/v1/user", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(validation.data),
        })
    }
        if(res.status === 201){
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
        message: "User created",
        errors: [],
    };
}

export async function getAllUsersAction() : Promise<{data: UserGetPayloadType[], messageError?: string}> {
    const data = await getAllUsers({})
    return data
}