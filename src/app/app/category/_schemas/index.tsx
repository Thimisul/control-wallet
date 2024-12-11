import { CategoryType } from "@prisma/client";
import { error } from "console";
import { number, z } from "zod";

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

export const CategoryFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nome não pode ser menor que 2 caracteres").max(20, "Nome não pode ser maior que 20 caracteres"),
  type: z.nativeEnum(CategoryType, { required_error: "Tipo de categoria é obrigatório" }),
  categoryId: z.string().optional(),
});

