'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { toast } from "../ui/use-toast"


type alertDialogProps = {
    id: string | number
    actionDelete: Function
}

async function handleDeleteCategory(actionDelete: Function, id: string | number) {
    const result = await actionDelete(id);

    if (result.success) {
        toast({
            title: "Registro excluído com sucesso",
            description: result.message,
            variant: "default",
            duration: 5000,
        });
    } else {
        toast({
            title: "Erro ao excluir registro",
            description: result.message,
            variant: "destructive",
            duration: 5000,
        });
    }
}

export const DeleteAlertDialog = ({ id, actionDelete }: alertDialogProps) => {

    return (
        <AlertDialog key={id}>
            <AlertDialogTrigger asChild><Button variant="destructive"><Trash className="w-4 h-4" /></Button></AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza que deseja excluir?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Essa ação não pode ser desfeita. Esta ação excluirá permanentemente o registro selecionado.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteCategory(actionDelete, id)}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteAlertDialog    