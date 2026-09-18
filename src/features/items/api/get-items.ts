import { apiClient } from "@/lib/api/api-client";
import type { AdminItemResponse, GetAdminItemsResult, GetAdminItemsParams } from "../types";

// Item routes are only mounted nested under a Product
// (/api/admin/products/{productUuid}/styles/{styleUuid}/items) - there is no
// flat /api/admin/styles/{styleUuid}/items route, even though the handlers
// themselves only look at styleUuid.

export async function getAdminItems(
  productUuid: string,
  styleUuid: string,
  params?: GetAdminItemsParams
): Promise<GetAdminItemsResult> {
  const response = await apiClient.get<AdminItemResponse[]>(
    `/api/admin/products/${productUuid}/styles/${styleUuid}/items`,
    {
      params: {
        page: params?.page,
        pageSize: params?.pageSize,
        search: params?.search,
        isActive: params?.isActive,
      },
    }
  );

  return {
    data: response.data ?? [],
    meta: response.meta,
  };
}

export async function getAdminItem(productUuid: string, styleUuid: string, itemUuid: string) {
  return apiClient.get<AdminItemResponse>(
    `/api/admin/products/${productUuid}/styles/${styleUuid}/items/${itemUuid}`
  );
}

export async function createAdminItem(
  productUuid: string,
  styleUuid: string,
  data: Record<string, unknown>
) {
  return apiClient.post<AdminItemResponse>(
    `/api/admin/products/${productUuid}/styles/${styleUuid}/items`,
    data
  );
}

export async function updateAdminItem(
  productUuid: string,
  styleUuid: string,
  itemUuid: string,
  data: Record<string, unknown>
) {
  return apiClient.put<AdminItemResponse>(
    `/api/admin/products/${productUuid}/styles/${styleUuid}/items/${itemUuid}`,
    data
  );
}

export async function deleteAdminItem(productUuid: string, styleUuid: string, itemUuid: string) {
  return apiClient.delete(
    `/api/admin/products/${productUuid}/styles/${styleUuid}/items/${itemUuid}`
  );
}
