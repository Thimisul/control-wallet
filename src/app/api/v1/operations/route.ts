import { NextRequest, NextResponse } from "next/server";
import { getAllOperations, createOperation } from "@/data/operation";

const parseQueryParams = (searchParams: URLSearchParams) => {
  return {
    startDate: searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined,
    endDate: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined,
    categoryId: searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined,
    observation: searchParams.get('observation') ?? undefined,
    statusEntrance: searchParams.get('statusEntrance') === 'true' ? true : searchParams.get('statusEntrance') === 'false' ? false : undefined,
    statusExit: searchParams.get('statusExit') === 'true' ? true : searchParams.get('statusExit') === 'false' ? false : undefined,
    statusOperation: searchParams.get('statusOperation') === 'true' ? true : searchParams.get('statusOperation') === 'false' ? false : undefined,
    entranceWalletId: searchParams.get('entranceWalletId') ? Number(searchParams.get('entranceWalletId')) : undefined,
    exitWalletId: searchParams.get('exitWalletId') ? Number(searchParams.get('exitWalletId')) : undefined,
    ownerId: searchParams.get('ownerId') ? String(searchParams.get('ownerId')) : undefined,
  };
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters = parseQueryParams(searchParams);

    const operations = await getAllOperations(filters);

    if (!operations.data || operations.data.length === 0) {
      return NextResponse.json({ msg: 'Operações não encontradas!' }, { status: 404 });
    }

    return NextResponse.json({ operations }, { status: 200 });
  } catch (error) {
    console.error('Error fetching operations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
    const operation = await request.json()

    if (!operation.value || !operation.date || !operation.categoryId || !operation.ownerId) {
        return NextResponse.json(
          { msg: "Os campos 'value', 'date', 'categoryId' e 'ownerId' são obrigatórios." },
          { status: 400 } // Bad Request
        );
      }

    const operationRes = await createOperation(operation)
    return NextResponse.json(operationRes, { status: 201 });
    }catch (error) {
        console.error('Error creating operation:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
