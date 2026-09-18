import { apiClient } from "@/lib/api/api-client";
import type { AdminStyleResponse, GetAdminStylesResult, GetAdminStylesParams } from "../types";

export async function getAdminStyles(
  productUuid: string,
  params?: GetAdminStylesParams
): Promise<GetAdminStylesResult> {
  const response = await apiClient.get<AdminStyleResponse[]>(
    `/api/admin/products/${productUuid}/styles`,
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

export async function getAdminStyleList(
  params?: GetAdminStylesParams
): Promise<GetAdminStylesResult> {
  const response = await apiClient.get<AdminStyleResponse[]>(`/api/admin/styles`, {
    params: {
      page: params?.page,
      pageSize: params?.pageSize,
      search: params?.search,
      isActive: params?.isActive,
      productId: params?.productId,
      categoryId: params?.categoryId,
    },
  });

  return {
    data: response.data ?? [],
    meta: response.meta,
  };
}

export async function getAdminStyle(productUuid: string, styleUuid: string) {
  return apiClient.get<AdminStyleResponse>(
    `/api/admin/products/${productUuid}/styles/${styleUuid}`
  );
}

export async function getAdminStyleByUuid(styleUuid: string) {
  return apiClient.get<AdminStyleResponse>(`/api/admin/styles/${styleUuid}`);
}

export async function createAdminStyle(
  productUuid: string,
  data: Record<string, unknown>
) {
  return apiClient.post<AdminStyleResponse>(
    `/api/admin/products/${productUuid}/styles`,
    data
  );
}

export async function updateAdminStyle(
  productUuid: string,
  styleUuid: string,
  data: Record<string, unknown>
) {
  return apiClient.put<AdminStyleResponse>(
    `/api/admin/products/${productUuid}/styles/${styleUuid}`,
    data
  );
}

export async function deleteAdminStyle(productUuid: string, styleUuid: string) {
  return apiClient.delete(`/api/admin/products/${productUuid}/styles/${styleUuid}`);
}
