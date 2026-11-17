import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userService } from "@/apis/user-service";

// 에러를 화면에서 직접 보여줄 때만 meta: { skipToast: true }
export function useUpdateOnboarding(options?: {
  meta?: { skipToast?: boolean };
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.updateOnboarding,
    // 응답이 저장된 전체 값이라 다시 조회하지 않고 캐시를 바로 바꾼다
    onSuccess: (data) =>
      queryClient.setQueryData(["user", "getOnboarding"], data),
    meta: options?.meta,
  });
}
