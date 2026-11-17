import {
  AndroidImportance,
  IosAuthorizationStatus,
  requestPermissionsAsync,
  setNotificationChannelAsync,
} from "expo-notifications";
import { Platform } from "react-native";

import type { NotificationPermission } from "@/types/user/user.types";

/** OS 알림 권한을 요청하고 결과를 서버 값으로 돌려준다 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  // Android 13+는 알림 채널이 하나 이상 있어야 권한 팝업이 뜬다
  if (Platform.OS === "android") {
    await setNotificationChannelAsync("default", {
      name: "기본",
      importance: AndroidImportance.DEFAULT,
    });
  }
  const settings = await requestPermissionsAsync();
  // iOS 임시 허용(provisional)도 알림을 받을 수 있어 허용으로 본다
  const isGranted =
    settings.granted ||
    settings.ios?.status === IosAuthorizationStatus.PROVISIONAL;
  return isGranted ? "GRANTED" : "DENIED";
}
