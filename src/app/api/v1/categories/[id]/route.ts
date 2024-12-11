import { deleteCategoryById, getCategoryById, updateCategoryById } from "@/data/category"
import { idParams } from "@/lib/utils"
import { NextRequest, NextResponse } from "next/server"


  export async function GET(request: Request,   { params }: idParams) {
    const id = (await params).id 
    const category = await getCategoryById(Number(id))
    if (!category) {
      return NextResponse.json({ msg: 'Category not found' }, {status: 404})
    }
    return NextResponse.json(category, {status: 200})
  }
  
  export async function PUT(request: NextRequest, { params }: idParams) {
    const id = (await params).id 
    const body = await request.json()
    const category = await updateCategoryById(Number(id ?? body.id), body)
    if (!category) {
      return NextResponse.json({ msg: 'Category not found' }, {status: 404})
    }
    return NextResponse.json({msg: 'Category updated', category}, {status: 200})
  }
  
  export async function DELETE(request: NextRequest, { params }: idParams) {
    const id = (await params).id 
    const categoryDeleted = await deleteCategoryById(Number(id))
    if (!categoryDeleted) {
      return NextResponse.json({ msg: 'Category not deleted' }, {status: 404})
    }
    return NextResponse.json({ msg: 'Category deleted' }, {status: 200})
  }     