import { createApiHandler } from "@/lib/api/api-handler";
import { apiSuccess } from "@/lib/api/api-response";
import { categoryService } from "@/features/categories/services/category.service";

export const GET = createApiHandler({
  GET: async () => {
    const tree = await categoryService.getCategoryTree();
    return apiSuccess(tree, "Category tree fetched successfully");
  },
});
