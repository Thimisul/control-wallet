'use server'
import { CategoryFilters, CategoryGetPayloadType, createCategory, deleteCategoryById, getAllCategories, getCategoryById, updateCategoryById } from "@/data/category";
import { Category, CategoryType, Prisma } from "@prisma/client";
import { da } from "date-fns/locale";
import { revalidatePath } from "next/cache";


export async function getAllCategoriesAction(filters: CategoryFilters): Promise<{ data: CategoryGetPayloadType[], messageError?: string }> {
    const data = await getAllCategories(filters)
    return data
}

export async function getCategoryByIdAction(id: number): Promise<{ data: CategoryGetPayloadType | null, messageError?: string }> {
    const data = await getCategoryById(id)
    return data
}

export async function createOrUpdateCategoryAction(category: Prisma.CategoryCreateInput | Prisma.CategoryUpdateInput, id?: number): Promise<{ success: boolean; message?: string }> {
    revalidatePath("/app/category");
    
    if(id){
       const {data, messageError} = await updateCategoryById(id, category)
       if(data){
           return { success: true, message: "Registro atualizado com sucesso!"};
       }else{
           return { success: false, message: messageError || "Erro ao atualizar registro" };
       }
    }else{
        const {data, messageError} = await createCategory(category as Prisma.CategoryCreateInput)
       if(data){
           return { success: true, message: "Registro criado com sucesso!"};
       }else{
           return { success: false, message: messageError || "Erro ao criar registro" };
       }
    }

}

export async function deleteCategoryByIdAction(id: number): Promise<{ success: boolean; message?: string }> {
    revalidatePath("/app/category");
    const category = await deleteCategoryById(id);
    
    if (category.data) {
        return { success: true, message: "Registro excluído com sucesso" };
    } else {
        return { success: false, message: category.messageError || "Erro ao excluir registro" };
    }
   
}