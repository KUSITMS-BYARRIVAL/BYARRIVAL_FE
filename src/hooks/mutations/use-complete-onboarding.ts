import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userService } from "@/apis/user-service";

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.completeOnboarding,
    onSuccess: (data) =>
      queryClient.setQueryData(["user", "getOnboarding"], data),
  });
}
