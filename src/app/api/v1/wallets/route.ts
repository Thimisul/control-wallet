import { createWallet, getAllWallets } from "@/data/wallets"
import { Prisma } from "@prisma/client"
import { NextResponse, NextRequest } from "next/server"

const parseQueryParams = (searchParams: URLSearchParams) => {
    return {
        id: searchParams.get('id') ? Number(searchParams.get('id')) : undefined,
        ownerId: searchParams.get('ownerId') ?? undefined,
        name: searchParams.get('name') ?? undefined,
        isVisible: searchParams.get('isVisible') === 'true' ? true : searchParams.get('isVisible') === 'false' ? false : undefined,
        walletId: searchParams.get('walletId') === 'null' ? null : searchParams.get('walletId') ? Number(searchParams.get('walletId')) : undefined,
    }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const filters = parseQueryParams(searchParams);
    const wallets = await getAllWallets(filters)	
    if (!wallets) {
        return NextResponse.json({ msg: 'Users not Found!' }, { status: 200 })
    }
    return NextResponse.json({ wallets  }, { status: 200 })
}

export async function POST(request: Request) {
    let data: { ownerId: string, name: string, initialValue: number, isVisible: boolean, participants: string[] } = await request.json()
    // const data = await request.json()
    const percentage = 100/data.participants.length
    const wallet = {
        ownerId: data.ownerId,
        name: data.name,
        initialValue: data.initialValue,
        isVisible: data.isVisible,
        participants: {
            create: data.participants ?
                    data.participants.map((p: string) => ({ user: { connect: { id: p } }, percentage: percentage })) : []
        }
    } as Prisma.WalletUncheckedCreateInput

    
    const walletRes = await createWallet(wallet)
    return NextResponse.json(walletRes)
}
