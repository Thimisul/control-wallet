import { saltAndHashPassword, verifyPassword } from "@/lib/password"
import { prisma } from "@/services/database"
import { User } from "@prisma/client"


const getUserEmailPassword = async (email: string | unknown, password: string | unknown): Promise<Partial<User> | null> => {
    if (typeof email === 'string' && typeof password === 'string') {
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            }
        })
        const verified = await verifyPassword(password, user?.password)    
        if(verified ) {
            return user
        }
    }
    return null
}

const createOrUpdateUser = async (email: string, password: string, name: string, image: string) : Promise<boolean> => {
    try {
        const pwHash = await saltAndHashPassword(password)
        const user = await getUserEmailPassword(email, password)
        if (user) {
            const updatedUser = await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    name: name,
                    image: image,
                    password: pwHash
                }
            })
            return true
        }
        else {
            const createdUser = await prisma.user.create({
                data: {
                    email: email,
                    name: name,
                    image: image,
                    password: pwHash
                }
            })
            return true
        }
    } catch (e) {
        return false
    }
}

export { getUserEmailPassword, createOrUpdateUser }