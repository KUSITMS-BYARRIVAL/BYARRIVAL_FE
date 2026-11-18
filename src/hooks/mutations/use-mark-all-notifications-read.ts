import { useMutation, useQueryClient } from "@tanstack/react-query";

import { notificationService } from "@/apis/notification-service";

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notification"] }),
  });
}
