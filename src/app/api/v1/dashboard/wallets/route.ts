

import { getAllWallets} from "@/data/wallets"
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
  const AllWallets = await getAllWallets(filters)
  if (!AllWallets) {
    return NextResponse.json({ msg: 'Categories not Found!' }, {status: 200})
  }
  return NextResponse.json({ AllWallets }, {status: 200})
} 
