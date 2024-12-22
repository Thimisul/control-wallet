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
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { FormWalletSchema } from '../_schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Edit2Icon, PlusIcon } from 'lucide-react';
import { WalletGetPayloadType } from '@/data/wallets';
import { getUserById, UserGetPayloadType } from '@/data/user';
import { createOrUpdateWalletAction } from '../_actions';
import { Participant } from '@prisma/client';

type WalletFormProps = {
  user?: any,
  wallets: WalletGetPayloadType[],
  data?: WalletGetPayloadType,
  users: UserGetPayloadType[],
  className?: string
}

const WalletForm = ({ user, wallets, users, data, className }: WalletFormProps) => {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [walletsList, setWalletsList] = useState<{ label: string, value: string }[] | []>
  (wallets?.map(item => ({
    label: item.name!,
    value: item.id?.toString()!
    })))
  const [participantsList, seParticipantsList] = useState<Option[]>
  (users?.map(item => ({
    label: item.name!,
    value: item.id?.toString()!
    })))
      
  const form = useForm<z.infer<typeof FormWalletSchema>>({
    resolver: zodResolver(FormWalletSchema),
    defaultValues: {
      id: data?.id ? data?.id.toString() : undefined,
      name: data?.name ?? '',
      initialValue: data?.initialValue ? Number(data?.initialValue) : 0,
      participants: data?.participants?.map((item) => ({
        label: item.user.name!,
        value: item.user.id?.toString()!,
        fixed: item.user.id?.toString()! === data.owner?.id?.toString()!
        })) ?? [{
          label: user?.name!,
          value: user?.id?.toString()!,
          fixed: true
          }],
      ownerId: user?.id ?? '',
    }
  })

  async function onSubmit(data: z.infer<typeof FormWalletSchema>) {
    debugger
    setLoading(true);
    const id = data?.id ? Number(data?.id) : undefined;
    const participants = data.participants.map(item => ({participantId: item.value, percentage: 10}))
    const wallet = {
      id: data?.id ? Number(data?.id) : undefined,
      name: data.name,
      initialValue: Number(data.initialValue),
      participants: participants,
      ownerId: user?.id ?? '',
      isVisible: true,
    }
    const res = await createOrUpdateWalletAction(wallet,participants, id)
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome da Carteira" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isVisible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Essa Carteira é visível para todos os usuários?
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="initialValue"
              render={({ field }) => (
                <FormItem className="max-w-32">
                  <FormLabel>Valor Inicial</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="R$" type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="participants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participantes</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      {...field}
                      value={field.value}
                      defaultOptions={participantsList}
                      placeholder="Selecione os participantes"
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          Sem Resultados.
                        </p>
                      }
                    />
                  </FormControl>
                  <FormMessage />
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
  );
};
export default WalletForm;
function getUserByIdAction(value: string): any {
  throw new Error('Function not implemented.');
}

