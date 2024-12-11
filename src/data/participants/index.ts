 import { prisma } from "@/services/database"
 import { Participant, Prisma } from "@prisma/client"


 export const getAllParticipantsByWalletId = async (walletId: number): Promise<Participant[]> => {
    try {
        const data = await prisma.participant.findMany({
            where: {
                walletId: walletId
            },
        })
        return data
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.log(error.code)
            const messageError = error.code
            return []
        }
        if (error instanceof Error) {
            console.error(error.message)
            const messageError = error.message
            return []
        }
    }
        return []
 }

 export const createParticipant = async (participantId: string, walletId: number, percentage: number): Promise<Participant | null> => {
    try {
        const data = await prisma.participant.create({
            data: {
                participantId: participantId,
                walletId: walletId,
                percentage: percentage,
            },
        })
        return data
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.log(error.code)
            const messageError = error.code
            return null
        }
        if (error instanceof Error) {
            console.error(error.message)
            const messageError = error.message
            return null
        }
    }    
        return null
}   

export const deleteParticipant = async (participantId: string, walletId: number): Promise<Participant | null> => {
    try {
    const data = await prisma.participant.delete({
        where: {
            participantId_walletId: {
                walletId: walletId,
                participantId: participantId
            }
        },
    })
    return data
}catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(error.code)
        const messageError = error.code
        return null
    }
    if (error instanceof Error) {
        console.error(error.message)
        const messageError = error.message
        return null
    }
}
    return null
}

