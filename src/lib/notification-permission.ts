import type { NotificationPermissionsStatus } from "expo-notifications";
import { Platform } from "react-native";

import type { NotificationPermission } from "@/types/user/user.types";

// 쓸 때만 불러온다 — 모듈이 없는 옛 개발 빌드에서도 화면은 열리고, 여기서만 실패한다
function loadNotifications(): typeof import("expo-notifications") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- 지연 로딩 (동적 import는 Jest가 지원하지 않음)
  return require("expo-notifications");
}

function toPermission(
  settings: NotificationPermissionsStatus,
): NotificationPermission {
  const { IosAuthorizationStatus } = loadNotifications();
  // iOS 임시 허용(provisional)도 알림을 받을 수 있어 허용으로 본다
  const isGranted =
    settings.granted ||
    settings.ios?.status === IosAuthorizationStatus.PROVISIONAL;
  return isGranted ? "GRANTED" : "DENIED";
}

/** OS 알림 권한을 요청하고 결과를 서버 값으로 돌려준다 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  const {
    AndroidImportance,
    requestPermissionsAsync,
    setNotificationChannelAsync,
  } = loadNotifications();
  // Android 13+는 알림 채널이 하나 이상 있어야 권한 팝업이 뜬다
  if (Platform.OS === "android") {
    await setNotificationChannelAsync("default", {
      name: "기본",
      importance: AndroidImportance.DEFAULT,
    });
  }
  return toPermission(await requestPermissionsAsync());
}

/** 팝업 없이 지금 OS 알림 권한을 확인한다. canAskAgain이 false면 팝업이 다시 뜨지 않아 휴대폰 설정으로 보내야 한다 */
export async function getNotificationPermission() {
  const settings = await loadNotifications().getPermissionsAsync();
  return {
    permission: toPermission(settings),
    canAskAgain: settings.canAskAgain,
  };
}
