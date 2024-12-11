import { deleteWalletById, getWalletById, updateWalletById } from "@/data/wallets"
import { idParams } from "@/lib/utils"
import { Prisma, Wallet } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: Request, { params }: idParams) {
    const id = (await params).id 
    const wallet = await getWalletById(Number(id))
    if (!wallet.data) {
        return NextResponse.json({ msg: 'Wallet not found' }, { status: 404 })
    }
    return NextResponse.json(wallet, { status: 200 })
}

export async function PUT(request: NextRequest, { params }: idParams) {
    const id = (await params).id 
    let data: { id: string, ownerId: string, name: string, initialValue: number, isVisible: boolean, participants: string[] } = await request.json()
    const percentage = 100/data.participants.length
    const participantsData = data.participants.map((p: string) => ({ participantId: p, percentage: percentage }))
    
    const wallet = {
        id: Number(data.id),
        ownerId: data.ownerId,
        name: data.name,
        initialValue: new Decimal(data.initialValue),
        isVisible: data.isVisible,

    } as Partial<Wallet>
    const walletRes = await updateWalletById(Number(id ?? data.id), wallet, participantsData)
    if (!walletRes) {
        return NextResponse.json({ msg: 'Wallet not found' }, { status: 404 })
    }
    return NextResponse.json({ msg: 'Wallet updated' }, { status: 200 })
}

export async function DELETE(request: NextRequest, { params }: idParams) {
    const id = (await params).id 
    const walletDeleted = await deleteWalletById(Number(id))
    if (!walletDeleted) {
        return NextResponse.json({ msg: 'Wallet not deleted' }, { status: 404 })
    }
    return NextResponse.json({ msg: 'Wallet deleted' }, { status: 200 })
} 