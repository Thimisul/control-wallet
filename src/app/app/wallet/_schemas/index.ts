import { id } from "date-fns/locale";
import { z } from "zod";

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
  fixed: z.boolean().optional(),
});

export const FormWalletSchema = z.object({
  id: z.string().optional(),
  ownerId: z.string().optional(),
  name: z.string(),
  initialValue: z.coerce.number(),
  participants: z.array(optionSchema),
  isVisible: z.boolean().default(false).optional(),
});

