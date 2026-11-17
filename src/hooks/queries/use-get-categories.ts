import { useQuery } from "@tanstack/react-query";

import { userService } from "@/apis/user-service";
import type { CategoryResponse } from "@/types/user/user.types";

export function useGetCategories() {
  return useQuery<CategoryResponse[]>({
    queryKey: ["user", "getCategories"],
    queryFn: userService.getCategories,
  });
}
