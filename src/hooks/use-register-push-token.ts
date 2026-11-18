import { useEffect } from "react";
import { Platform } from "react-native";

import { notificationService } from "@/apis/notification-service";
import { getFcmToken, onFcmTokenRefresh } from "@/lib/fcm-token";
import { useAuthStore } from "@/stores/auth-store";

/** 로그인 상태인 동안 이 기기의 FCM 토큰을 서버에 등록한다 (토큰이 바뀌면 다시 등록) */
export function useRegisterPushToken() {
  const isLoggedIn = useAuthStore((state) => state.accessToken !== null);

  useEffect(() => {
    if (!isLoggedIn) return;
    // 루트 레이아웃은 QueryClientProvider 바깥이라 useMutation 없이 서비스를 직접 부른다
    // 실패는 넘어간다 — 시뮬레이터는 토큰이 없고, 다음 실행 때 다시 등록된다
    const register = (fcmToken: string) =>
      notificationService
        .register({
          fcmToken,
          platform: Platform.OS === "ios" ? "IOS" : "ANDROID",
        })
        .catch(() => undefined);
    getFcmToken()
      .then(register)
      .catch(() => undefined);
    return onFcmTokenRefresh(register);
  }, [isLoggedIn]);
}
