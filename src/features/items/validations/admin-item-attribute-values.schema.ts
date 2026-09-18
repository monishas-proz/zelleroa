import { z } from "zod";

export const setItemAttributeValuesSchema = z
  .object({
    attributeValueIds: z.array(z.string().trim().min(1)),
  })
  .strict();

export type SetItemAttributeValuesInput = z.infer<typeof setItemAttributeValuesSchema>;
