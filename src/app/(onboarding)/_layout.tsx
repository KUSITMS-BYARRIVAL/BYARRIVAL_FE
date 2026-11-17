import { Stack } from "expo-router";

// 온보딩 화면 묶음. 가드로 들어오면 닉네임부터 시작한다 (지정하지 않으면 이름순 첫 화면인 complete로 갈 수 있다)
export const unstable_settings = { initialRouteName: "nickname" };

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 약관 아래에 닉네임이 깔리므로 동의 전에 스와이프로 빠져나가지 못하게 한다 */}
      <Stack.Screen name="terms" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
