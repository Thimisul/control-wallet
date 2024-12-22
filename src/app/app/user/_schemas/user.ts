import { z } from "zod";

export const EditUserSchema = z.object({
  name: z.string().min(2, "Nome não pode ser menor que 2 caracteres").max(20, "Nome não pode ser maior que 20 caracteres").nullable(),
  email: z.string().email("Enail inválido").nullable(),
  image: z.string().url("Invalid image url").nullable(),
});
