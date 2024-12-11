'use server'
import { getAllOperations, OperationFilters, OperationGetPayloadType, getOperationById, updateOperationById, createOperation, deleteOperationById } from "@/data/operation";
import { auth } from "@/services/auth/auth";
import { Operation, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";


export async function getAllOperationsAction(filters: OperationFilters): Promise<{ data: OperationGetPayloadType[], messageError?: string }> {
    const data = await getAllOperations(filters)
    return data
}

export async function getOperationsByIdAction(id: number): Promise<{ data: OperationGetPayloadType | null, messageError?: string }> {
    const data = await getOperationById(id)
    return data
}

export async function createOrUpdateOperationAction(operation: Prisma.OperationCreateInput | Prisma.OperationUpdateInput, id?: number): Promise<{ success: boolean; message?: string }> {
    revalidatePath("/app/operation");
    
    if(id){
       const {data, messageError} = await updateOperationById(id, operation)
       if(data){
           return { success: true, message: "Registro atualizado com sucesso!"};
       }else{
           return { success: false, message: messageError || "Erro ao atualizar registro" };
       }
    }else{
        const {data, messageError} = await createOperation(operation as Prisma.OperationCreateInput)
       if(data){
           return { success: true, message: "Registro criado com sucesso!"};
       }else{
           return { success: false, message: messageError || "Erro ao criar registro" };
       }
    }

}

export async function deleteOperationByIdAction(id: number): Promise<{ success: boolean; message?: string }> {
    revalidatePath("/app/operation");
    const category = await deleteOperationById(id);
    
    if (category.data) {
        return { success: true, message: "Registro excluído com sucesso" };
    } else {
        return { success: false, message: category.messageError || "Erro ao excluir registro" };
    }
   
}