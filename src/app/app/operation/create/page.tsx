import {getAllCategoriesAction }  from "@/app/app/category/_actions"
import OperationForm from "../_components/operationForm"
import { auth } from "@/services/auth/auth"
import { getAllWalletsAction } from "../../wallet/_actions"

const OperationCreatePage = async () => {
    const session = await auth()
    const {data, messageError} = await getAllCategoriesAction({})
    const walletsSelect = await getAllWalletsAction({})

    return (
        <OperationForm categories={data}  wallets={walletsSelect.data} user={session?.user}></OperationForm>
    )
}

export default OperationCreatePage