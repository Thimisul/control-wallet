import { z } from "zod";

export const OperationFormSchema = z.object({
  id: z.string().optional(),
  date: z.date(),
  value: z.coerce.number().min(0, "Valor não pode ser negativo"),
  observation: z.string().max(255, "Observação não pode ser maior que 255 caracteres").optional(),
  statusEntrance: z.boolean().default(false),
  categoryId: z.string().min(1, "Categoria não pode ser vazia"),
  statusExit: z.boolean().default(false),
  entranceWalletId: z.string().optional(),
  exitWalletId: z.string().optional(),
  statusOperation: z.boolean().default(false),
})
// .refine(schema => {
//   return !(
//       schema.value == 0 && 
//       schema.observation === undefined
//   ); 
// }, "Valor ou Observação não pode ser vazio");
