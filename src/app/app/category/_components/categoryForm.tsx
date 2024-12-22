'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import * as React from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { LoadingButton } from '@/components/ui/loading-button';
import { CategoryFormSchema } from '../_schemas';
import { Input } from '@/components/ui/input';
import { createOrUpdateCategoryAction } from '../_actions';
import { CardContent, CardFooter } from '@/components/ui/card';
import { CategoryType, Prisma } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit2Icon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation'
import { CategoryGetPayloadType } from '@/data/category';

type CategoryFormProps = {
    user?: any,
    categories: CategoryGetPayloadType[],
    data?: any,
    className?: string
}

const CategoryForm = ({ user, categories, data, className }: CategoryFormProps) => {
    const router = useRouter()
    const [categoriesList, setCategoriesList] = useState<{ label: string, value: string }[] | []>([])

    const form = useForm<z.infer<typeof CategoryFormSchema>>({
        resolver: zodResolver(CategoryFormSchema),
        defaultValues: {
            id: data?.id?.toString() ?? '',
            name: data?.name ?? '',
            type: data?.type ?? undefined,
            categoryId: data?.categoryId?.toString() ?? '',
        }
    })

    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    function handleCategoryType(values: string[]) {
        const types = values.filter(value => value !== '')
 
        switch (true) {
            case types.includes('ENTRANCE') && types.includes('EXIT'):
                form.setValue('type', CategoryType.BOTH)
                setCategoriesList(categories.filter(category => category.type == CategoryType.BOTH).map(item => ({
                    label: item.name!,
                    value: item.id?.toString()!
                })))
                break;
            case types.includes('ENTRANCE'):
                form.setValue('type', CategoryType.ENTRANCE)
                setCategoriesList(categories.filter(category => category.type == CategoryType.ENTRANCE).map(item => ({
                    label: item.name!,
                    value: item.id?.toString()!
                })))
                break;
            case types.includes('EXIT'):
                form.setValue('type', CategoryType.EXIT)
                setCategoriesList(categories.filter(category => category.type == CategoryType.EXIT).map(item => ({
                    label: item.name!,
                    value: item.id?.toString()!
                })))
                break;
            default:
                form.setValue('type', undefined!)
                setCategoriesList([])
                break;
        }
    }

    async function onSubmit(data: z.infer<typeof CategoryFormSchema>) {
        setLoading(true);
        const id = data?.id ? Number(data?.id) : undefined;
        const category = {
            name: data?.name ?? '',
            type: data?.type,
            categoryId: data?.categoryId ? Number(data?.categoryId) : null,
        }
        const res = await createOrUpdateCategoryAction(category, id)
        if (res.success) {
            setLoading(false);
            setOpen(false);
            form.reset()
            toast({
                title: res?.message,
            });
        }else {
            toast({
                title: res?.message,
                variant: "destructive",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(res, null, 2)}</code>
                    </pre>
                ),
            });
        }
    }

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
                    <DialogTitle className='flex flex-row gap-x-4'>{data?.id ? <Edit2Icon className="w-4 h-4" />:<PlusIcon className="w-4 h-4" />} Categoria </DialogTitle>
                    <DialogDescription>
                        Categorias são usadas para agrupar os tipos de operações.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Nome da Carteira" disabled={data?.id} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo</FormLabel>
                                        <FormControl>
                                            <ToggleGroup type="multiple" onValueChange={(value) => { handleCategoryType(value) }} defaultValue={[field.value]} className="w-full" disabled={data?.id}>
                                                <ToggleGroupItem variant={'outline'} value={CategoryType.ENTRANCE} className="w-1/2">Entrada</ToggleGroupItem>
                                                <ToggleGroupItem variant={'outline'} value={CategoryType.EXIT} className="w-1/2">Saída</ToggleGroupItem>
                                            </ToggleGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {categoriesList.length > 0 && (
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cartegoria da Operação</FormLabel>
                                        <Select onValueChange={(value) => { field.onChange(value) }} defaultValue={field.value} >
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
                            />)}
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


    );
};
export default CategoryForm;
