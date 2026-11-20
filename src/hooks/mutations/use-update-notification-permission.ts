import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userService } from "@/apis/user-service";

export function useUpdateNotificationPermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.updateNotificationPermission,
    // 수신 설정 응답에 저장된 권한이 같이 와서 다시 불러온다
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["notification", "getSettings"],
      }),
    // 권한 저장은 부가 기능이라 실패해도 흐름을 막거나 알리지 않는다
    meta: { skipToast: true },
  });
}
