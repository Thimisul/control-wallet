"use client"

import { CategoryGetPayloadType } from "@/data/category"
import { Category, Prisma } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<CategoryGetPayloadType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ cell }) => {
      switch (cell.getValue()) {
        case "ENTRANCE":
          return "Entrada"
        case "EXIT":
          return "Saída"
        case "BOTH":
          return "Entrada e Saída"
      }
    },
  },
  {
    accessorKey: "categoryId",
    header: "Categoria Pai",
    cell: ({ cell }) => {
      const category = cell.row.original.category
      if (category) {
        return category.name
      }
    },
  },
]
