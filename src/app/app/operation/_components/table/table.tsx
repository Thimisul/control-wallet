import { auth } from "@/services/auth/auth"
import { getAllOperationsAction } from "../../_actions"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { getAllWalletsAction } from "@/app/app/wallet/_actions"
import { getAllCategoriesAction } from "@/app/app/category/_actions"

export default async function TableOperation() {
  const session = await auth()
  const allOperations = await getAllOperationsAction({})
  const allWallets = await getAllWalletsAction({})
  const allCategories = await getAllCategoriesAction({})

  return (
    <div className="container mx-auto">
      <DataTable user={session?.user} columns={columns} data={allOperations.data} wallets={allWallets.data} categories={allCategories.data} />  
    </div>
  )
}
