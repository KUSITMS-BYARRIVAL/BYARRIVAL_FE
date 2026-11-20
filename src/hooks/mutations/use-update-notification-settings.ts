import { useMutation, useQueryClient } from "@tanstack/react-query";

import { notificationService } from "@/apis/notification-service";

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationService.updateSettings,
    // 응답이 바뀐 전체 설정이라 다시 조회하지 않고 캐시를 바로 바꾼다
    onSuccess: (data) =>
      queryClient.setQueryData(["notification", "getSettings"], data),
  });
}
