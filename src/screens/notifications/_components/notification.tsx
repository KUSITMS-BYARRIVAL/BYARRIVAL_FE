import type { ReactNode } from "react";
import { Pressable, type PressableProps, Text, View } from "react-native";

import { cn } from "@/lib/cn";

type NotificationProps = Omit<PressableProps, "children"> & {
  /** 38px 원형 유형 아이콘 */
  icon: ReactNode;
  title: string;
  body: string;
  /** 받은 시간 표시 문구 (예: '방금', '10월 12일') */
  time: string;
  isUnread?: boolean;
  className?: string;
};

export function Notification({
  icon,
  title,
  body,
  time,
  isUnread = false,
  className,
  ...props
}: NotificationProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={isUnread ? "안 읽은 알림" : undefined}
      className={cn(
        "flex-row items-start gap-4 px-5 py-4",
        isUnread ? "bg-green-50" : "bg-default",
        className,
      )}
      {...props}
    >
      {({ pressed }) => (
        <>
          {pressed && <View className="absolute inset-0 bg-btn-pressed" />}
          {icon}
          <View className="flex-1 gap-1">
            <View className="flex-row items-center gap-2">
              <Text className="flex-1 text-primary text-body2-sb">{title}</Text>
              {isUnread && (
                <View
                  testID="unread-dot"
                  className="size-2 rounded-full bg-green-500"
                />
              )}
            </View>
            <View className="gap-1">
              <Text className="text-secondary text-body3-r">{body}</Text>
              <Text className="text-tertiary text-caption1-m">{time}</Text>
            </View>
          </View>
        </>
      )}
    </Pressable>
  );
}
