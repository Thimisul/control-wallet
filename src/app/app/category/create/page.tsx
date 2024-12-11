import { auth } from "@/services/auth/auth"
import CategoryForm from "../_components/categoryForm"
import { getAllCategoriesAction } from "../_actions";


const WalletCreatePAge = async () => {
    const session = await auth();
    const { data, messageError } = await getAllCategoriesAction({})

    return (
        <CategoryForm categories={data} user={session?.user} />
    )
}

export default WalletCreatePAge