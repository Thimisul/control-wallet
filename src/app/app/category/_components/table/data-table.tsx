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
import { deleteCategoryByIdAction } from "../../_actions"
import { Edit2Icon, PlusIcon } from "lucide-react"
import DeleteAlertDialog from "@/components/crud/alertDelete"
import { useRouter } from "next/navigation"
import CategoryForm from "../categoryForm"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ZodIssue } from "zod"
import { Category, CategoryType, Prisma } from "@prisma/client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { CategoryGetPayloadType } from "@/data/category"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  categories: CategoryGetPayloadType[]
  messageError?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  categories,
  messageError
}: DataTableProps<TData, TValue>) {

  useEffect(() => {
    if (messageError) {
      toast({
        title: messageError,
        variant: "destructive",
      });
    }
  }, [messageError]);

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

  function getCategoryLabel(item: CategoryType): string {
    switch (item) {
      case CategoryType.ENTRANCE:
        return "Entrada";
      case CategoryType.EXIT:
        return "Saída";
      case CategoryType.BOTH:
        return "Entrada e Saída";
      default:
        return item;
    }
  }

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
          <Select value={(table.getColumn("type")?.getFilterValue() as string) ?? ""}
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
              {categories.map((item) => (
                <SelectItem value={item!.id.toString()} key={item!.id}>
                  {item!.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
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
                  <TableHead className="text-center w-14">Ações</TableHead>
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
                      <CategoryForm categories={categories} data={row.original}></CategoryForm>
                      <DeleteAlertDialog id={row.getValue('id') as string} actionDelete={deleteCategoryByIdAction} />
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
                  <CategoryForm categories={categories}></CategoryForm>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
