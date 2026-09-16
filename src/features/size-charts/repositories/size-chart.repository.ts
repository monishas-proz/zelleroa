import { db } from "@/lib/db/prisma";
import type { products_gender } from "@/generated/prisma";

export const sizeChartRepository = {
  async findByCategoryAndGender(categoryInternalId: bigint, gender: products_gender) {
    return db.size_charts.findMany({
      where: { category_id: categoryInternalId, gender, is_active: true },
      orderBy: { sort_order: "asc" },
      include: { attribute_values: { select: { uuid: true, value: true } } },
    });
  },

  /** Replaces the full size list for one category+gender combination. */
  async setForCategoryGender(
    categoryInternalId: bigint,
    gender: products_gender,
    attributeValueInternalIds: bigint[]
  ) {
    await db.$transaction([
      db.size_charts.deleteMany({
        where: { category_id: categoryInternalId, gender },
      }),
      ...(attributeValueInternalIds.length
        ? [
            db.size_charts.createMany({
              data: attributeValueInternalIds.map((attribute_value_id, index) => ({
                category_id: categoryInternalId,
                gender,
                attribute_value_id,
                sort_order: index,
              })),
            }),
          ]
        : []),
    ]);
  },
};
