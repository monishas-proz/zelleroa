import { ApiError } from "@/lib/api/api-error";
import { db } from "@/lib/db/prisma";
import { sizeChartRepository } from "../repositories/size-chart.repository";
import type { products_gender } from "@/generated/prisma";
import type { SizeChartEntry } from "../types";

async function resolveCategoryInternalId(categoryUuidOrId: string): Promise<bigint | null> {
  const numericId = Number(categoryUuidOrId);
  const category = await db.productCategory.findFirst({
    where: {
      OR: [
        { uuid: categoryUuidOrId },
        ...(Number.isFinite(numericId) ? [{ id: BigInt(numericId) }] : []),
      ],
    },
    select: { id: true },
  });
  return category?.id ?? null;
}

async function resolveAttributeValueInternalIds(uuids: string[]): Promise<bigint[]> {
  if (!uuids.length) return [];
  const values = await db.attributeValue.findMany({
    where: { uuid: { in: uuids }, is_active: true },
    select: { id: true, uuid: true },
  });
  const byUuid = new Map(values.map((v) => [v.uuid, v.id]));
  // Preserve the caller's order so sort_order reflects their intended display order.
  return uuids.map((uuid) => byUuid.get(uuid)).filter((id): id is bigint => id !== undefined);
}

export const sizeChartService = {
  /**
   * The valid size list for a category+gender combination, or an empty array
   * when the category has no size chart configured (e.g. Watches, Mobiles) -
   * the storefront and admin form both treat that as "no Size selector".
   */
  async getSizeChart(
    categoryUuidOrId: string,
    gender: products_gender
  ): Promise<SizeChartEntry[]> {
    const categoryId = await resolveCategoryInternalId(categoryUuidOrId);
    if (!categoryId) return [];

    const rows = await sizeChartRepository.findByCategoryAndGender(categoryId, gender);
    return rows.map((row) => ({
      id: row.attribute_values.uuid || String(row.attribute_value_id),
      value: row.attribute_values.value,
      sortOrder: row.sort_order,
    }));
  },

  async setSizeChart(
    categoryUuidOrId: string,
    gender: products_gender,
    attributeValueUuids: string[]
  ): Promise<SizeChartEntry[]> {
    const categoryId = await resolveCategoryInternalId(categoryUuidOrId);
    if (!categoryId) {
      throw ApiError.notFound("Category not found");
    }

    const attributeValueIds = await resolveAttributeValueInternalIds(attributeValueUuids);
    await sizeChartRepository.setForCategoryGender(categoryId, gender, attributeValueIds);

    return this.getSizeChart(categoryUuidOrId, gender);
  },
};
