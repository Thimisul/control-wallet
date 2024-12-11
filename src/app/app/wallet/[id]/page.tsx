import { auth } from "@/services/auth/auth"
import WalletForm from "../_components/walletForm"
import {getAllWalletsAction, getWalletByIdAction } from "../_actions"
import WalletCard from "../../dashboard/_components/walletCard"
import { getAllUsersAction } from "@/app/user/_actions"
import { idParams } from "@/lib/utils"


const WalletEditPage = async ({ params }: idParams) => {
    const id = (await params).id
    const session = await auth()
    const data = await getWalletByIdAction(Number(id))
    const allWallets = await getAllWalletsAction({})
    const allUsers = await getAllUsersAction()

    console.log(data)
    return (
        <>
            <WalletForm user={session?.user} wallets={allWallets.data} users={allUsers.data} data={data.data ?? undefined}></WalletForm>
        </>
    )
}

export default WalletEditPage