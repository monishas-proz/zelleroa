import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { ApiError } from "@/lib/api/api-error";
import { attributeService } from "@/features/attributes/services/attribute.service";
import {
  setItemAttributeValuesSchema,
  type SetItemAttributeValuesInput,
} from "@/features/items/validations/admin-item-attribute-values.schema";

export const GET = createApiHandler(
  {
    GET: async (_request, context) => {
      const itemUuid = context.params?.itemUuid;
      if (!itemUuid) {
        throw ApiError.badRequest("Item UUID is required");
      }

      const groups = await attributeService.getAttributeValuesForItem(itemUuid);
      return apiSuccess(groups, "Item attribute values fetched successfully");
    },
  },
  {
    method: "GET",
    requireAuth: true,
    requiredRole: ["ADMIN"],
  }
);

export const PUT = createApiHandler(
  {
    PUT: async (_request, context) => {
      const itemUuid = context.params?.itemUuid;
      if (!itemUuid) {
        throw ApiError.badRequest("Item UUID is required");
      }

      const body = context.body as SetItemAttributeValuesInput;
      const groups = await attributeService.setAttributeValuesForItem(
        itemUuid,
        body.attributeValueIds
      );

      return apiSuccess(groups, "Item attribute values updated successfully");
    },
  },
  {
    method: "PUT",
    requireAuth: true,
    requiredRole: ["ADMIN"],
    bodySchema: setItemAttributeValuesSchema,
  }
);
