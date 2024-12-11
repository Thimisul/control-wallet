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
import { deleteOperationByIdAction } from "../../_actions"
import { CalendarIcon, Edit2Icon, PlusIcon } from "lucide-react"
import DeleteAlertDialog from "@/components/crud/alertDelete"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Category, CategoryType, Wallet } from "@prisma/client"
import { useState } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select"
import router from "next/router"
import { Input } from "@/components/ui/input"
import OperationForm from "../operationForm"
import { WalletGetPayloadType } from "@/data/wallets"
import { CategoryGetPayloadType } from "@/data/category"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"
import { DateRangePicker } from "@/components/ui/calendar-ranger"


interface DataTableProps<TData, TValue> {
  user?: any
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  wallets: WalletGetPayloadType[]
  categories:CategoryGetPayloadType[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  user,
  wallets,
  categories
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
 
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[240px] pl-3 text-left font-normal",
                                                            !table.getColumn("date")?.getFilterValue() && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {table.getColumn("date")?.getFilterValue() ? (
                                                            format(table.getColumn("date")?.getFilterValue() as string, "dd/MM/yyyy")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                            <DateRangePicker
                                              onUpdate={(values) => console.log(values)}
                                              align="start"
                                           
                                              showCompare={false}
                                            />
                                            </PopoverContent>
                                        </Popover>
        {/* <Select value={(table.getColumn("type")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) => table.getColumn("type")?.setFilterValue(value === '*' ? "" : value)} // Adicione o onValueChange para atualizar o filtro
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="*" key="all">
              Todos
            </SelectItem>
            {Object.values(CategoryType).map((item) => (
              <SelectItem value={item} key={item}>
                {getCategoryLabel(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={(table.getColumn("categoryId")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) => { table.getColumn("categoryId")?.setFilterValue(value === '*' ? "" : value) }} // Adicione o onValueChange para atualizar o filtro
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoria Pai" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="*" key="all">
              Todos
            </SelectItem>
            {categories.map((item: Partial<Category>) => (
              <SelectItem value={item?.id!.toString()} key={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
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
                <TableCell className="flex flex-row gap-2 justify-end">
                <OperationForm key={row.id} user={user} wallets={wallets} categories={categories} data={row.original}></OperationForm>
                <DeleteAlertDialog id={row.getValue('id') as string} actionDelete={deleteOperationByIdAction} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
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
                  <OperationForm user={user} wallets={wallets} categories={categories}></OperationForm>
                </TableCell>
              </TableRow>
        </TableBody>
      </Table>
      </CardContent>
      </Card>
    </>
  )
}
