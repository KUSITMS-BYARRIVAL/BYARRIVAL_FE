import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userService } from "@/apis/user-service";

export function useDeleteProfileImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.deleteProfileImage,
    // 응답이 바뀐 내 정보 전체(profileImageUrl 포함)라 캐시를 바로 바꾼다
    onSuccess: (data) => queryClient.setQueryData(["user", "getMe"], data),
  });
}
