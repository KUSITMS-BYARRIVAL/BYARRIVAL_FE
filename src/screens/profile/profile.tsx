import { router } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "@/components/header/header";

// TODO: 프로필 화면은 추후 구현 (UT 범위에서는 이동만 연결)
export function ProfileScreen() {
  const { top } = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-default" style={{ paddingTop: top }}>
      <Header title="프로필" onBack={router.back} />
    </View>
  );
}
