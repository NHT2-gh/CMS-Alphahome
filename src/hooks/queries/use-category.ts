import { queryKeys } from "@/config/query-keys";
import { categoryService } from "@/services/category.service";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.all(),
    queryFn: () => categoryService.getCategories(),
  });
};
