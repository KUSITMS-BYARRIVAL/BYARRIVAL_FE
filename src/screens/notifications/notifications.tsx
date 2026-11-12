import { router } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TextButton } from "@/components/button/text-button";
import { Header } from "@/components/header/header";
import { Notification } from "@/components/notification/notification";
import { NOTIFICATION_GROUPS } from "@/mocks/notification";
import { NOTIFICATION_TYPES } from "@/screens/notifications/_constants";
import { useNotificationStore } from "@/stores/notification-store";
import { useToastStore } from "@/stores/toast-store";

export function NotificationsScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const readIds = useNotificationStore((state) => state.readIds);

  useEffect(() => {
    useNotificationStore.getState().clearNewNotification();
  }, []);

  const hasUnread = NOTIFICATION_GROUPS.some((group) =>
    group.items.some((item) => !readIds.includes(item.id)),
  );

  const handleReadAll = () => {
    useNotificationStore.getState().markAllRead();
    useToastStore.getState().showToast({ message: "모두 읽음 처리했어요" });
  };

  return (
    <View className="flex-1 bg-default" style={{ paddingTop: top }}>
      <Header
        title="알림"
        onBack={router.back}
        right={
          <TextButton
            label="모두 읽음"
            hasArrow={false}
            disabled={!hasUnread}
            onPress={handleReadAll}
          />
        }
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: bottom + 30 }}
      >
        {NOTIFICATION_GROUPS.filter((group) => group.items.length > 0).map(
          (group) => (
            <View key={group.label}>
              <Text className="px-5 pb-3.5 pt-5 text-secondary text-body2-m">
                {group.label}
              </Text>
              {group.items.map((item) => {
                const { Icon, href } = NOTIFICATION_TYPES[item.type];
                return (
                  <Notification
                    key={item.id}
                    icon={<Icon width={38} height={38} />}
                    title={item.title}
                    body={item.body}
                    time={item.time}
                    isUnread={!readIds.includes(item.id)}
                    onPress={() => {
                      useNotificationStore.getState().markRead(item.id);
                      router.push(href);
                    }}
                  />
                );
              })}
            </View>
          ),
        )}
        <Text className="pt-10 text-center text-tertiary text-body2-r">
          알림은 30일 동안 보관돼요.
        </Text>
      </ScrollView>
    </View>
  );
}
