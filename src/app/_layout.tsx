import "../../global.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { PostHogProvider } from "posthog-react-native";
import { useEffect } from "react";

import { useRegisterPushToken } from "@/hooks/use-register-push-token";
import { useTrackScreen } from "@/hooks/use-track-screen";
import { posthog } from "@/lib/analytics";
import { queryClient } from "@/lib/query-client";
import { DialogHost } from "@/screens/_components/dialog-host";
import { ToastHost } from "@/screens/_components/toast-host";
import { useAuthStore } from "@/stores/auth-store";

// 폰트 로딩 · 저장된 세션 확인이 끝날 때까지 스플래시를 유지한다 (컴포넌트 밖, 모듈 스코프에서 호출해야 함)
SplashScreen.preventAutoHideAsync();
// 스플래시에서 첫 화면으로 끊기지 않게 넘어가도록 (iOS만 지원)
SplashScreen.setOptions({ fade: true });

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Pretendard-Regular": require("@/assets/fonts/Pretendard-Regular.otf"),
    "Pretendard-Medium": require("@/assets/fonts/Pretendard-Medium.otf"),
    "Pretendard-SemiBold": require("@/assets/fonts/Pretendard-SemiBold.otf"),
    "Pretendard-Bold": require("@/assets/fonts/Pretendard-Bold.otf"),
  });

  const isRestored = useAuthStore((state) => state.isRestored);
  const isLoggedIn = useAuthStore((state) => state.accessToken !== null);
  const isOnboarded = useAuthStore((state) => state.isOnboarded);
  const isTermsAgreed = useAuthStore((state) => state.isTermsAgreed);
  useRegisterPushToken();
  // 세션에 맞는 첫 화면: 비로그인 → 인트로, 약관 미동의 → 약관, 온보딩 전 → 닉네임, 완료 → 홈
  const entry = !isLoggedIn
    ? "/intro"
    : !isOnboarded
      ? isTermsAgreed
        ? "/nickname"
        : "/terms"
      : "/";
  // 로딩 실패 시에는 시스템 폰트로라도 앱을 띄운다
  const isReady = (fontsLoaded || !!fontError) && isRestored;
  // 가드가 여는 그룹과 같은 기준 (아래 Stack.Protected)
  useTrackScreen(
    !isReady
      ? null
      : !isLoggedIn
        ? "auth"
        : !isOnboarded
          ? "onboarding"
          : "app",
  );

  useEffect(() => {
    // 읽기에 실패하면 비로그인으로 시작한다 (스플래시는 복원 완료 표시로 풀린다)
    useAuthStore
      .getState()
      .restoreSession()
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (isReady) SplashScreen.hide();
  }, [isReady]);

  if (!isReady) return null;

  return (
    // 화면은 Expo Router 경로로 직접 기록하고, 터치 자동 수집은 누른 글자가 함께 남아 끈다 (docs/analytics_events.md)
    <PostHogProvider
      client={posthog}
      autocapture={{ captureScreens: false, captureTouches: false }}
    >
      <QueryClientProvider client={queryClient}>
        {/* 세션에 맞는 그룹만 열어 둔다. 지금 그룹이 닫히면 redirectTo로 이동한다
          (지정하지 않으면 루트 첫 화면 '/'로 가는데, '/'는 홈 그룹 안이라 열려 있지 않을 때 찾을 수 없는 경로가 된다)
          iOS 스와이프 뒤로 가기는 막고 헤더 뒤로가기로만 이동한다. 하위 Stack은 이 옵션을 물려받지 않아 그룹 레이아웃마다 따로 둔다 */}
        <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
          <Stack.Protected guard={!isLoggedIn} redirectTo={entry}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
          <Stack.Protected
            guard={isLoggedIn && !isOnboarded}
            redirectTo={entry}
          >
            <Stack.Screen name="(onboarding)" />
          </Stack.Protected>
          <Stack.Protected guard={isLoggedIn && isOnboarded} redirectTo={entry}>
            <Stack.Screen name="(app)" />
          </Stack.Protected>
        </Stack>
        <DialogHost />
        <ToastHost />
      </QueryClientProvider>
    </PostHogProvider>
  );
}
