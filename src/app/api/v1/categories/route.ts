import { createCategory, getAllCategories} from "@/data/category"
import { CategoryType } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = Number(searchParams.get('id') || undefined)
  const categoryId = Number(searchParams.get('categoryId') || undefined) 
  const name = searchParams.get('name') ?? undefined
  const type =  searchParams.get('type') ? CategoryType[searchParams.get('type') as keyof typeof CategoryType] : undefined
  const queryParams = {id, categoryId, name, type}

  const categories = await getAllCategories(queryParams)
  if (!categories) {
    return NextResponse.json({ msg: 'Categories not Found!' }, {status: 200})
  }
  return NextResponse.json({ categories }, {status: 200})
} 

export async function POST(request: Request) {
  const data = await request.json()
  const category = await createCategory(data)
  if (!category) {
    return NextResponse.json({ msg: 'Category not Found!' }, {status: 200})
  }
  return NextResponse.json({ category }, {status: 200})
}
