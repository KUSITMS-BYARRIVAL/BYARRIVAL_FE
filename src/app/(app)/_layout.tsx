import { Redirect, Stack } from "expo-router";

import { useOnboardingStore } from "@/stores/onboarding-store";

// 홈·라이드 등 온보딩을 마친 뒤 쓰는 화면 묶음
export default function AppLayout() {
  const isOnboarded = useOnboardingStore((state) => state.isOnboarded);

  // 온보딩 전이면 인트로(ONB-01)부터 시작한다
  // 개발 중에는 온보딩을 매번 거치지 않고 화면을 바로 열 수 있게 막지 않는다
  // TODO: 로그인 연동 후 토큰 없음 → 인트로, 온보딩 미완료 → 중단한 단계로 나눠 보내기
  if (!__DEV__ && !isOnboarded) return <Redirect href="/intro" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
