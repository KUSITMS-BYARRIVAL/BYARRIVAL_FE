import { useQuery } from "@tanstack/react-query";

import { userService } from "@/apis/user-service";
import type { TermsResponse } from "@/types/user/user.types";

export function useGetTerms() {
  return useQuery<TermsResponse[]>({
    queryKey: ["user", "getTerms"],
    queryFn: userService.getTerms,
  });
}
