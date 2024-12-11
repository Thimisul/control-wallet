import { hash, compare } from "bcrypt"

export const saltAndHashPassword = async (password: string | unknown) => {
    if(typeof password === 'string') {
        const salt = await hash(password, 10)
        return salt
    }
    else {
        return null
    }
}

export const verifyPassword = async (password: string | unknown, hashedPassword: string | unknown) => {
    if(typeof password === 'string' && typeof hashedPassword === 'string') {
        return await compare(password, hashedPassword)
    }   
}           