import { getUserById, deleteUserById, updateUserById } from "@/data/user"
import { idParams } from "@/lib/utils"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: Request,{ params }: idParams) {
  const id = (await params).id 
  const user = await getUserById(id)
  if (!user) {
    return NextResponse.json({ msg: 'User not found' }, {status: 404})
  }
  return NextResponse.json(user, {status: 200})
}

export async function PUT(request: NextRequest, { params }: idParams) {
  const id = (await params).id 
  const body = await request.json()
  const user = await updateUserById(id ?? body.id, body)
  if (!user) {
    return NextResponse.json({ msg: 'User not found' }, {status: 404})
  }
  return NextResponse.json({msg: 'User updated'}, {status: 200})
}

export async function DELETE(request: NextRequest, { params }: idParams) {
  const id = (await params).id 
  const userDeleted = await deleteUserById(id)
  if (!userDeleted) {
    return NextResponse.json({ msg: 'User not deleted' }, {status: 404})
  }
  return NextResponse.json({ msg: 'User deleted' }, {status: 200})
}