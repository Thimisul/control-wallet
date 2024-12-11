import { getAllUsers} from "@/data/user"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const users = await getAllUsers({})
  if (!users) {
    return NextResponse.json({ msg: 'Users not Found!' }, {status: 200})
  }
  return NextResponse.json({ users }, {status: 200})
} 

