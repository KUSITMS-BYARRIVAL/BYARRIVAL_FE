import { useMutation } from "@tanstack/react-query";

import { userService } from "@/apis/user-service";

export function useUpdateNotificationPermission() {
  return useMutation({
    mutationFn: userService.updateNotificationPermission,
    // 권한 저장은 부가 기능이라 실패해도 흐름을 막거나 알리지 않는다
    meta: { skipToast: true },
  });
}
