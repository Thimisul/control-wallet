"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, PlusIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { OperationFormSchema } from "../_schemas"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingButton } from "@/components/ui/loading-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Category, CategoryType, Wallet } from "@prisma/client"
import { createOrUpdateOperationAction } from "../_actions"
import { useState } from "react"
import React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Edit2Icon } from "lucide-react"
import { WalletGetPayloadType } from "@/data/wallets"

type OperationFormProps = {
    user?: any,
    categories: Partial<Category>[],
    wallets: Partial<WalletGetPayloadType>[],
    data?: any,
    className?: string
}

const OperationForm = ({ user, wallets, categories, data, className }: OperationFormProps) => {

    const [loading, setLoading] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState(false);
    const [operationType, setOperationType] = useState<CategoryType>( data ? data.category.type : CategoryType.ENTRANCE);
    const [categoriesList, setCategoriesList] = useState<{ label: string, value: string }[] | []>
    (categories.filter(category => data ? category.type == data.category.type  : category.type == CategoryType.ENTRANCE)
    .map(item => ({
            label: item.name!,
            value: item.id?.toString()!
        })));
    const [walletsList, setWalletsList] = useState<{ label: string, value: string }[] | []>
    (wallets?.map(item => ({
        label: item.name!,
        value: item.id?.toString()!
        })));
    const form = useForm<z.infer<typeof OperationFormSchema>>({
        resolver: zodResolver(OperationFormSchema),
        defaultValues: {
            id: data?.id ? data?.id.toString() : undefined,
            date: data?.date ? data?.date : new Date(),
            value: data?.value ? data?.value : 0,
            categoryId: data?.category ? data?.category?.id?.toString() : '',
            entranceWalletId: data?.entranceWallet ? data?.entranceWallet?.id?.toString() : '',
            statusEntrance: data?.statusEntrance ? data?.statusEntrance : true,
            exitWalletId: data?.exitWallet ? data?.exitWallet?.id?.toString() : '',
            statusExit: data?.statusExit ? data?.statusExit : false,
            statusOperation: data?.statusOperation ? data?.statusOperation : true,
            observation: data?.observation ? data?.observation : '',
        }
    })

    function handleOperationType(value: string) {
        console.log(value)
        switch (value) {
            case CategoryType.ENTRANCE:
                form.setValue('exitWalletId', '')
                form.setValue('statusEntrance', true)
                form.setValue('statusExit', false)
                form.setValue('statusOperation', true)
                setCategoriesList(categories.filter(category => category.type == CategoryType.ENTRANCE ||
                    category.type == CategoryType.BOTH).map(item => ({
                        label: item.name!,
                        value: item.id?.toString()!
                    })))
                    setOperationType(CategoryType.ENTRANCE)
                break;
            case CategoryType.EXIT:
                form.setValue('entranceWalletId', '')
                form.setValue('statusEntrance', false)
                form.setValue('statusExit', true)
                form.setValue('statusOperation', true)
                setCategoriesList(categories.filter(category => category.type == CategoryType.EXIT ||
                    category.type == CategoryType.BOTH).map(item => ({
                        label: item.name!,
                        value: item.id?.toString()!
                    })))
                    setOperationType(CategoryType.EXIT)
                break;
            default:
                form.setValue('statusOperation', false)
                form.setValue('statusEntrance', false)
                form.setValue('statusExit', false)
                setCategoriesList(categories.filter(category => category.type == CategoryType.BOTH)
                    .map(item => ({
                        label: item.name!,
                        value: item.id?.toString()!
                    })))
                setOperationType(CategoryType.BOTH)
                break;
        }
    }

    async function onSubmit(data: z.infer<typeof OperationFormSchema>) {
        console.log("Criando Operação")
        console.log(data)
        setLoading(true);
        const operation = {
            id: data?.id ? Number(data?.id) : undefined,
            date: data.date,
            value: Number(data.value),
            categoryId: data.categoryId == "" ? null : Number(data.categoryId),
            entranceWalletId: data.entranceWalletId == "" ? null : Number(data.entranceWalletId),
            statusEntrance: data.statusEntrance,
            exitWalletId: data.exitWalletId == "" ? null : Number(data.exitWalletId),
            statusExit: data.statusExit,
            statusOperation: data.statusOperation,
            observation: data.observation,
            ownerId: user?.id ?? '',
        }
        const res = await createOrUpdateOperationAction(operation, Number(data?.id))
        if (res) {
            setLoading(false);
            setOpen(false);
            toast({
                title: 'Carteira criada com sucesso',
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(res, null, 2)}</code>
                    </pre>
                ),
            });
        }
    }
    console.log(data)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button
                className={cn(data?.id ? "icon-only" : "w-full", className)}
                variant={data?.id ? "secondary" : "default"}>
                {data?.id ? <Edit2Icon className="w-4 h-4" /> : <> <PlusIcon className="w-4 h-4" />Adicionar</>} 
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader className="text-center">
                <DialogTitle className='flex flex-row gap-x-4'>{data?.id ? <Edit2Icon className="w-4 h-4" />:<PlusIcon className="w-4 h-4" />} Carteiras </DialogTitle>
                <DialogDescription>
                    Carteiras são usadas para agrupar as operações.
                </DialogDescription>
            </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <CardContent className="space-y-4"  >
                        <ToggleGroup type="single" onValueChange={(value) => { handleOperationType(value) }} defaultValue={data ? data.category.type : CategoryType.ENTRANCE} className="w-full">
                            <ToggleGroupItem variant={'outline'} value={CategoryType.ENTRANCE} className="w-1/3">Entrada</ToggleGroupItem>
                            <ToggleGroupItem variant={'outline'} value={CategoryType.EXIT} className="w-1/3">Saída</ToggleGroupItem>
                            <ToggleGroupItem variant={'outline'} value={CategoryType.BOTH} className="w-1/3">Transferência</ToggleGroupItem>
                        </ToggleGroup>
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cartegoria da Operação</FormLabel>
                                    <Select onValueChange={(value) => { console.log(value); field.onChange(value) }} defaultValue={field.value} >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione uma opção" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categoriesList.map((item) => (
                                                <SelectItem value={item.value} key={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-row">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Data da Operação</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[240px] pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "dd/MM/yyyy")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    locale={ptBR}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Valor R$</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="R$" type="number" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="observation"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Observação</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="entranceWalletId"
                            render={({ field }) => (
                                <FormItem hidden={operationType == CategoryType.EXIT}>
                                    <FormLabel>Carteira de Entrada</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione uma opção" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {walletsList.map((item) => (
                                                <SelectItem value={item.value} key={item.value} >
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="statusEntrance"
                            render={({ field }) => (
                                <FormItem className={operationType != CategoryType.BOTH ? 'hidden' : 'flex flex-row items-start space-x-3 space-y-0 p-2 shadow'}>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            O dono da carteira de entrada aprova a operação?
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="exitWalletId"
                            render={({ field }) => (
                                <FormItem hidden={operationType == CategoryType.ENTRANCE}>
                                    <FormLabel>Carteira de Saída</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione uma opção" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {walletsList.map((item) => (
                                                <SelectItem value={item.value} key={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="statusExit"
                            render={({ field }) => (
                                <FormItem className={operationType != CategoryType.BOTH ? 'hidden' : 'flex flex-row items-start space-x-3 space-y-0 p-2 shadow'}>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            O dono da carteira de saída aprova a operação?
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="statusOperation"
                            render={({ field }) => (
                                <FormItem className={operationType != CategoryType.BOTH ? 'hidden' : 'flex flex-row items-start space-x-3 space-y-0 p-2 shadow'}>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Operação realizada?
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <LoadingButton loading={loading} type="submit" className="ml-auto">
                            Salvar
                        </LoadingButton>
                    </CardFooter>
            </form>
        </Form>
        </DialogContent>
        </Dialog>
    )
}
export default OperationForm


