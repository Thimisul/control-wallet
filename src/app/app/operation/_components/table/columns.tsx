"use client"

import { Button } from "@/components/ui/button"
import { Operation } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { CheckIcon, XCircleIcon } from "lucide-react"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"
import { OperationGetPayloadType } from "@/data/operation"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<OperationGetPayloadType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "date",
    header: "Data",
    cell({ cell }) {
      const date = cell.getValue() as Date
      return <span>{format(date, "dd/MM/yyyy")}</span>
    },
  },
  {
    accessorKey: "category.type",
    header: "Tipo",
    cell: (cell) => {
      const type = cell.getValue()
      return <span>{
        type === "ENTRANCE" ? "Entrada" :
        type === "EXIT" ? "Saída" :
        type === "BOTH" ? "Transferência" : ''
      }</span>
    }
  },
  {
    accessorKey: "entranceWallet.name",
    header: "Carteira de Entrada",
    cell({ cell, row }) {
      const entranceWallet = cell.getValue() as { name: string, id: number }
      return (
        <div className="flex flex-row gap-2 ">
          <span>{entranceWallet && (row.original.statusEntrance === true ? <CheckIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />)}</span>
          <span>{entranceWallet && entranceWallet.name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "exitWallet.name",
    header: "Carteira de Saída",
    cell({ cell, row }) {
      const exitWallet = cell.getValue() as { name: string, id: number }
      return (
        <div className="flex flex-row gap-2 ">
          <span>{exitWallet && (row.original.statusExit === true ? <CheckIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />)}</span>
          <span>{exitWallet && exitWallet.name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "statusOperation",
    header: "Status de Operação",
    cell({ cell, row }) {
      const statusOperation = cell.getValue() as boolean
      return (
        <div className="flex flex-row gap-2 ">
          <span>{statusOperation && (row.original.statusOperation === true ? <CheckIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />)}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "value",
    header: "Valor",
    cell({ cell }) {
      return <span> R$ {Number(cell.getValue()).toFixed(2)}</span>
    },
  },
]
