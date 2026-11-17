import { Stack } from "expo-router";

// 들어올 수 있는지는 루트 _layout의 가드가 정한다 (로그인 + 온보딩 완료)
export const unstable_settings = { initialRouteName: "(tabs)" };

// 홈·라이드 등 온보딩을 마친 뒤 쓰는 화면 묶음
export default function AppLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
