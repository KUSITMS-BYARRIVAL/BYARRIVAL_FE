import { Stack } from "expo-router";

// 비로그인 화면 묶음. 가드로 들어오면 인트로부터 시작한다
export const unstable_settings = { initialRouteName: "intro" };

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
