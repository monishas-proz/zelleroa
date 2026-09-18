import { z } from "zod";

export const setProductAttributesSchema = z
  .object({
    attributeIds: z.array(z.string().trim().min(1)),
    force: z.boolean().optional().default(false),
  })
  .strict();

export type SetProductAttributesInput = z.infer<typeof setProductAttributesSchema>;
