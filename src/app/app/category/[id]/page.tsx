import { auth } from "@/services/auth/auth"
import CategoryForm from "../_components/categoryForm"
import { getAllCategoriesAction, getCategoryByIdAction } from "../_actions"
import { idParams } from "@/lib/utils"


const CategoryEditPage = async ({ params }: idParams) => {
    const id = (await params).id
    const session = await auth()
    const data = await getCategoryByIdAction(Number(id))
    const categories = await getAllCategoriesAction({})
 
    return (
        <CategoryForm categories={categories.data} user={session?.user} data={data}></CategoryForm>
    )
}

export default CategoryEditPage