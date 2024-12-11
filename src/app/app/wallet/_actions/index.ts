'use server';
import { Participant, Prisma} from "@prisma/client";
import { createWallet, deleteWalletById, getAllWallets, getWalletById, updateWalletById, WalletFilters, WalletGetPayloadType } from "@/data/wallets";
import { revalidatePath } from "next/cache";
import { Decimal } from "@prisma/client/runtime/library";
import { FormWalletSchema } from "../_schemas";

type ActionResponseType = { success: boolean; message?: string }

// export default async function walletAction(_prevState: any, params: FormData): Promise<{ errors: ZodIssue[], message: string }> {
//     const session = await auth()
//     params.set("ownerId", session?.user?.id!)
//     const validation = FormWalletSchema.safeParse({
//         name: params.get("name"),
//         initialValue: params.get("initialValue"),
//         isVisible: params.get("isVisible"),
//         participants: params.get("participants"),
//         ownerId: params.get("ownerId"),
//     });

//     if (validation.success) {
//         let res
//         if (true) {
//             res = await fetch("http://localhost:3000/api/v1/wallet", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Accept": "application/json",
//                 },
//                 body: JSON.stringify(validation.data),
//             })
//         } else {
//             res = await fetch("http://localhost:3000/api/v1/wallet", {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Accept": "application/json",
//                 },
//                 body: JSON.stringify(validation.data),
//             })
//         }
//         if (res.status === 201) {
//             return {
//                 message: "Wallet created",
//                 errors: [],
//             }
//         }
//     } else {
//         return {
//             message: "Error",
//             errors: validation.error.issues,
//         };
//     }
//     return {
//         message: "Wallet created",
//         errors: [],
//     };
// }

export async function getAllWalletsAction({id,ownerId,name,isVisible,walletId}: WalletFilters): Promise<{data: WalletGetPayloadType[], messageError?: string}> {
    const allWallets = await getAllWallets({ id, ownerId, name, isVisible, walletId })
    const allWalletsData = allWallets.data.map(wallet => ({
        ...wallet,
        initialValue: wallet.initialValue instanceof Decimal  ? wallet.initialValue.toNumber() : wallet.initialValue,
      }));
    return { data: allWalletsData, messageError: allWallets.messageError }	
}

export const getWalletByIdAction = async (id: number): Promise<{ data: WalletGetPayloadType | null, messageError?: string }> => {
    const data = await getWalletById(id)
    return data
}

export async function createOrUpdateWalletAction(data: Prisma.WalletCreateManyInput , participants: {participantId: string, percentage: number}[], id?: number): Promise<ActionResponseType> {
    revalidatePath("/app/wallet");
    
    const wallet = {
        ownerId: data?.ownerId,
        name: data.name,
        initialValue: data.initialValue,
        isVisible: data.isVisible,
    }
    
    if(id){
       const {data, messageError} = await updateWalletById(id, wallet, participants)
       if(data){
           return { success: true, message: "Registro atualizado com sucesso!"};
       }else{
           return { success: false, message: messageError || "Erro ao atualizar registro" };
       }
    }else{
        const {data, messageError} = await createWallet(wallet)
       if(data){
           return { success: true, message: "Registro criado com sucesso!"};
       }else{
           return { success: false, message: messageError || "Erro ao criar registro" };
       }
    }
}

export async function deleteWalletAction(id: number): Promise<{ success: boolean; message?: string }> {
    revalidatePath("/app/wallet");
    const wallet = await deleteWalletById(id);
    
    if (wallet.data) {
        return { success: true, message: "Registro excluído com sucesso" };
    } else {
        return { success: false, message: wallet.messageError || "Erro ao excluir registro" };
    }
}

// const sumOperationsWallet = (entrance: { value: string, statusOperation: boolean }[], exit: { value: string, statusOperation: boolean }[]) => {


//     const operationsEntrancePendent = entrance.filter(operation => operation.statusOperation === false)
//         .reduce((soma: number, o: { value: string, statusOperation: boolean }) =>
//             soma + Number(o.value), 0)

//     const operationsEntranceCompleted = entrance.filter(operation => operation.statusOperation === true)
//         .reduce((soma: number, o: { value: string, statusOperation: boolean }) =>
//             soma + Number(o.value), 0)

//     const operationsExitsPendent = exit.filter(operation => operation.statusOperation === false)
//         .reduce((soma: number, o: { value: string, statusOperation: boolean }) =>
//             soma + Number(o.value), 0)

//     const operationsExitsCompleted = exit.filter(operation => operation.statusOperation === true)
//         .reduce((soma: number, o: { value: string, statusOperation: boolean }) =>
//             soma + Number(o.value), 0)

//     return {
//         operationsEntrancePendent,
//         operationsEntranceCompleted,
//         operationsEntranceTotal: operationsEntrancePendent + operationsEntranceCompleted,
//         operationsExitsPendent,
//         operationsExitsCompleted,
//         operationsExitsTotal: operationsExitsPendent + operationsExitsCompleted,
//         operationsPendentTotal: operationsEntrancePendent - operationsExitsPendent,
//         operationsCompletedTotal: operationsEntranceCompleted - operationsExitsCompleted,
//         operationsTotal: operationsEntrancePendent + operationsEntranceCompleted - operationsExitsPendent - operationsExitsCompleted,

//     }
// }
