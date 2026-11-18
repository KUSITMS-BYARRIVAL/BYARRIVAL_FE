import { useQuery } from "@tanstack/react-query";

import { notificationService } from "@/apis/notification-service";
import type { UnreadCount } from "@/types/notification/notification.types";

export function useGetUnreadCount() {
  return useQuery<UnreadCount>({
    queryKey: ["notification", "getUnreadCount"],
    queryFn: notificationService.getUnreadCount,
  });
}
