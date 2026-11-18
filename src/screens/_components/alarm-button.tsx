import { router } from "expo-router";
import { Pressable } from "react-native";

import { AlarmDotIcon, AlarmIcon } from "@/assets/icons";
import { useGetUnreadCount } from "@/hooks/queries/use-get-unread-count";

export function AlarmButton() {
  const { data } = useGetUnreadCount();
  const hasNewNotification = (data?.count ?? 0) > 0;
  const Icon = hasNewNotification ? AlarmDotIcon : AlarmIcon;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={hasNewNotification ? "알림, 새 알림 있음" : "알림"}
      onPress={() => router.push("/notifications")}
    >
      <Icon width={24} height={24} />
    </Pressable>
  );
}
