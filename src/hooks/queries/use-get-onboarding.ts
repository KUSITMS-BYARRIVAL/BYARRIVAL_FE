import { useQuery } from "@tanstack/react-query";

import { userService } from "@/apis/user-service";
import type { OnboardingResponse } from "@/types/user/user.types";

export function useGetOnboarding() {
  return useQuery<OnboardingResponse>({
    queryKey: ["user", "getOnboarding"],
    queryFn: userService.getOnboarding,
  });
}
