import { createApiHandler } from "@/lib/api/api-handler";
import { apiCreated } from "@/lib/api/api-response";
import { ApiError } from "@/lib/api/api-error";
import { variantService } from "@/features/variants/services/variant.service";
import { itemService } from "@/features/items/services/item.service";
import { styleService } from "@/features/styles/services/style.service";
import {
  generateVariantsSchema,
  type GenerateVariantsInput,
} from "@/features/variants/validations/admin-variant.schema";

// Legacy Product-scoped shim: resolve the Product's default Style, then that
// Style's default Item.
async function resolveDefaultItemUuidForProduct(productUuid: string): Promise<string> {
  const styleUuid = await styleService.resolveDefaultStyleUuid(productUuid);
  return itemService.resolveDefaultItemUuid(styleUuid);
}

export const POST = createApiHandler(
  {
    POST: async (_request, context) => {
      const productUuid = context.params?.uuid;
      if (!productUuid) {
        throw ApiError.badRequest("Product UUID is required");
      }

      const body = context.body as GenerateVariantsInput;
      const adminEmail = context.session?.user?.email ?? undefined;
      const itemUuid = await resolveDefaultItemUuidForProduct(productUuid);

      const result = await variantService.generateVariants(itemUuid, body, adminEmail);

      return apiCreated(
        result,
        `${result.created} item${result.created === 1 ? "" : "s"} created${
          result.skipped > 0
            ? `, ${result.skipped} combination(s) skipped (already existed, or not allowed by a configured attribute dependency rule)`
            : ""
        }`
      );
    },
  },
  {
    method: "POST",
    requireAuth: true,
    requiredRole: ["ADMIN"],
    bodySchema: generateVariantsSchema,
  }
);
