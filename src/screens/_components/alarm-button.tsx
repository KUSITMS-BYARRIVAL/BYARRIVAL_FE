import { router } from "expo-router";
import { Pressable } from "react-native";

import { AlarmDotIcon, AlarmIcon } from "@/assets/icons";
import { useNotificationStore } from "@/stores/notification-store";

export function AlarmButton() {
  const hasNewNotification = useNotificationStore(
    (state) => state.hasNewNotification,
  );
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
