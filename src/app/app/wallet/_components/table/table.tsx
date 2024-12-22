import { auth } from "@/services/auth/auth"
import { getAllWalletsAction } from "../../_actions"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { getAllUsersAction } from "@/app/app/user/_actions"

export default async function TableWallet() {
  const session = await auth()
  const allWallets = await getAllWalletsAction({})
  const allUsers = await getAllUsersAction()
  
  return (
    <div className="container mx-auto">
      <DataTable user={session?.user} columns={columns} data={allWallets.data} wallets={allWallets.data} users={allUsers.data}  />
    </div>
  )
}


