import { router } from "expo-router";
import { SectionList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TextButton } from "@/components/button/text-button";
import { Header } from "@/components/header/header";
import { useMarkAllNotificationsRead } from "@/hooks/mutations/use-mark-all-notifications-read";
import { useMarkNotificationRead } from "@/hooks/mutations/use-mark-notification-read";
import { useGetNotifications } from "@/hooks/queries/use-get-notifications";
import { useGetUnreadCount } from "@/hooks/queries/use-get-unread-count";
import { Notification } from "@/screens/notifications/_components/notification";
import { NOTIFICATION_TYPES } from "@/screens/notifications/_constants";
import {
  formatNotificationTime,
  groupNotifications,
} from "@/screens/notifications/_helpers";
import { useToastStore } from "@/stores/toast-store";

export function NotificationsScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetNotifications();
  const { data: unread } = useGetUnreadCount();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();

  const now = new Date();
  const sections = groupNotifications(
    data?.pages.flatMap((page) => page.notifications) ?? [],
    now,
  );

  const handleReadAll = () =>
    markAllRead(undefined, {
      onSuccess: () =>
        useToastStore.getState().showToast({ message: "모두 읽음 처리했어요" }),
    });

  return (
    <View className="flex-1 bg-default" style={{ paddingTop: top }}>
      <Header
        title="알림"
        onBack={router.back}
        right={
          <TextButton
            label="모두 읽음"
            hasArrow={false}
            disabled={!unread?.count || isMarkingAll}
            onPress={handleReadAll}
          />
        }
      />
      <SectionList
        contentContainerStyle={{ paddingBottom: bottom + 30 }}
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        stickySectionHeadersEnabled={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        renderSectionHeader={({ section }) => (
          <Text className="px-5 pb-3.5 pt-5 text-secondary text-body2-m">
            {section.title}
          </Text>
        )}
        renderItem={({ item }) => {
          // 앱이 모르는 새 유형이 와도 목록이 깨지지 않게 홈 이동으로 둔다
          const { Icon, href } =
            NOTIFICATION_TYPES[item.type] ?? NOTIFICATION_TYPES.TEST;
          return (
            <Notification
              icon={<Icon width={38} height={38} />}
              title={item.title}
              body={item.body}
              time={formatNotificationTime(item.createdAt, now)}
              isUnread={!item.read}
              onPress={() => {
                if (!item.read) markRead(item.id);
                router.push(href);
              }}
            />
          );
        }}
        // 로딩 · 에러(전역 토스트) 중에는 data가 없어 빈 화면 문구를 띄우지 않는다
        ListEmptyComponent={
          data ? (
            <Text className="pt-10 text-center text-secondary text-body2-m">
              아직 받은 알림이 없어요
            </Text>
          ) : undefined
        }
        ListFooterComponent={
          <Text className="pt-10 text-center text-tertiary text-body2-r">
            알림은 30일 동안 보관돼요.
          </Text>
        }
      />
    </View>
  );
}
