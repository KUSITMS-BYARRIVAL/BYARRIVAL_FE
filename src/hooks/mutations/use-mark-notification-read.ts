import { useMutation, useQueryClient } from "@tanstack/react-query";

import { notificationService } from "@/apis/notification-service";

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notification"] }),
  });
}
