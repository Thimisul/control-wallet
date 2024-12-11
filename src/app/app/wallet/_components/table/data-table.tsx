"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { deleteWalletAction } from "../../_actions"
import DeleteAlertDialog from "@/components/crud/alertDelete"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Wallet, User } from "@prisma/client"
import { Input } from "@/components/ui/input"
import WalletForm from "../walletForm"
import { WalletGetPayloadType } from "@/data/wallets"
import { UserGetPayloadType } from "@/data/user"

interface DataTableProps<TData, TValue> {
  user?: any
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  wallets: WalletGetPayloadType[]
  users: UserGetPayloadType[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  wallets,
  users,
  user
}: DataTableProps<TData, TValue>) {

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  })

  return (
    <>
      <Card className="mb-2">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-4 p-4">
          <Input
            placeholder="Nome"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Dados</CardTitle>
        </CardHeader>
        <CardContent >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <TableCell key={row.id+'actions'} className="flex flex-row gap-2 justify-end">
                  <WalletForm  user={user} wallets={wallets} users={users} data={row.original as WalletGetPayloadType}></WalletForm>
                  <DeleteAlertDialog key={row.id+'_delete'} id={row.getValue('id') as string} actionDelete={deleteWalletAction} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell key={'no-results'} colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
           <TableRow className="w-auto max-w-9">
                <TableCell colSpan={columns.length}>
                  <div className="text-left space-x-2 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      Next
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-end">
                  <WalletForm key={'form'} user={user} wallets={wallets} users={users}></WalletForm>
                </TableCell>
              </TableRow>
        </TableBody>
      </Table>
      </CardContent>
      </Card>
    </>
  )
}
