import { auth } from "@/services/auth/auth"
import { getAllCategoriesAction } from "../../_actions"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { getAllCategories } from "@/data/category"

export default async function TableCategory() {
  const session = await auth()
  const {data, messageError} = await getAllCategories({})
  
  return (
    <div className="container mx-auto">
      <DataTable  columns={columns} 
                  categories={data} 
                  data={data} 
                  messageError={messageError}>
      </DataTable>
    </div>
  )
}
