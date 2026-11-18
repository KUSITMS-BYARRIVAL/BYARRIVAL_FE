import { Stack } from "expo-router";

// 온보딩 화면 묶음. 가드로 들어오면 닉네임부터 시작한다 (지정하지 않으면 이름순 첫 화면인 complete로 갈 수 있다)
export const unstable_settings = { initialRouteName: "nickname" };

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }} />
  );
}
