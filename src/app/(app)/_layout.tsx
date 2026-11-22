import { Stack } from "expo-router";

import { useRefreshNotificationsOnPush } from "@/hooks/use-refresh-notifications-on-push";
import { useOpenPushNotification } from "@/screens/notifications/_hooks/use-open-push-notification";

// 들어올 수 있는지는 루트 _layout의 가드가 정한다 (로그인 + 온보딩 완료)
export const unstable_settings = { initialRouteName: "(tabs)" };

// 홈·라이드 등 온보딩을 마친 뒤 쓰는 화면 묶음
export default function AppLayout() {
  // 로그인 · 온보딩을 마친 뒤에만 열리는 곳이라 푸시로 이동할 화면이 항상 열려 있다
  useOpenPushNotification();
  useRefreshNotificationsOnPush();
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }} />
  );
}
