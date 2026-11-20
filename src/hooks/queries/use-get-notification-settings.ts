import { useQuery } from "@tanstack/react-query";

import { notificationService } from "@/apis/notification-service";
import type { NotificationSettings } from "@/types/notification/notification.types";

export function useGetNotificationSettings() {
  return useQuery<NotificationSettings>({
    queryKey: ["notification", "getSettings"],
    queryFn: notificationService.getSettings,
  });
}
