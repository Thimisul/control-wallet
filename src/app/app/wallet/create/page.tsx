import { auth } from "@/services/auth/auth"
import WalletForm from "../_components/walletForm"
import { getAllUsersAction } from "@/app/user/_actions"
import { getAllWalletsAction } from "../_actions"


const WalletCreatePAge = async () => {
    const session = await auth()
    const allUsers = await getAllUsersAction()
    const allWallets = await getAllWalletsAction({})

    return (
        <WalletForm user={session?.user} wallets={allWallets.data} users={allUsers.data}></WalletForm>
    )
}

export default WalletCreatePAge