import { apiClient } from "@/lib/api/api-client";
import type { AttributeListItem, CategoryAttributeOption } from "../types";

export interface GetAttributesResult {
  data: AttributeListItem[];
  meta: { page: number; limit: number; pageSize: number; total: number; totalPages: number };
}

export async function getAdminAttributes(
  params?: Record<string, string | number | boolean | undefined | null>
) {
  const page = Number(params?.page) || 1;
  const limit = Number(params?.pageSize) || 10;
  const response = await apiClient.get<AttributeListItem[]>("/api/admin/attributes", { params });
  const total = response.meta?.total ?? response.data?.length ?? 0;
  const totalPages = response.meta?.totalPages ?? Math.max(1, Math.ceil(total / limit));
  return {
    data: response.data ?? [],
    meta: {
      page: response.meta?.page ?? page,
      limit: response.meta?.limit ?? limit,
      pageSize: response.meta?.pageSize ?? limit,
      total,
      totalPages,
    },
  } satisfies GetAttributesResult;
}

export async function getAdminAttribute(uuid: string) {
  const response = await apiClient.get<AttributeListItem>(`/api/admin/attributes/${uuid}`);
  return response.data as AttributeListItem;
}

export async function createAttribute(data: Record<string, unknown>) {
  const response = await apiClient.post<AttributeListItem>("/api/admin/attributes", data);
  return response.data as AttributeListItem;
}

export async function updateAttribute(uuid: string, data: Record<string, unknown>) {
  const response = await apiClient.put<AttributeListItem>(`/api/admin/attributes/${uuid}`, data);
  return response.data as AttributeListItem;
}

export async function deleteAttribute(uuid: string) {
  const response = await apiClient.delete<null>(`/api/admin/attributes/${uuid}`);
  return response;
}

export async function addAttributeValue(
  attributeUuid: string,
  value: string,
  priceAdjustment?: number
) {
  const response = await apiClient.post<AttributeListItem>(
    `/api/admin/attributes/${attributeUuid}/values`,
    { value, priceAdjustment }
  );
  return response.data as AttributeListItem;
}

export async function updateAttributeValue(
  attributeUuid: string,
  valueUuid: string,
  value: string,
  priceAdjustment?: number
) {
  const response = await apiClient.put<AttributeListItem>(
    `/api/admin/attributes/${attributeUuid}/values/${valueUuid}`,
    { value, priceAdjustment }
  );
  return response.data as AttributeListItem;
}

export async function deleteAttributeValue(attributeUuid: string, valueUuid: string) {
  const response = await apiClient.delete<AttributeListItem>(
    `/api/admin/attributes/${attributeUuid}/values/${valueUuid}`
  );
  return response.data as AttributeListItem;
}

export async function setAttributeCategories(attributeUuid: string, categoryIds: string[]) {
  const response = await apiClient.put<AttributeListItem>(
    `/api/admin/attributes/${attributeUuid}/categories`,
    { categoryIds }
  );
  return response.data as AttributeListItem;
}

export async function getAttributesForCategory(categoryUuid: string) {
  const response = await apiClient.get<CategoryAttributeOption[]>(
    `/api/admin/categories/${categoryUuid}/attributes`
  );
  return response.data ?? [];
}
