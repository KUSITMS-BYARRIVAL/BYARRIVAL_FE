import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userService } from "@/apis/user-service";

export function useReplaceInterestCategories() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.replaceInterestCategories,
    // 응답이 바뀐 내 정보 전체라 다시 조회하지 않고 캐시를 바로 바꾼다
    onSuccess: (data) => queryClient.setQueryData(["user", "getMe"], data),
  });
}
