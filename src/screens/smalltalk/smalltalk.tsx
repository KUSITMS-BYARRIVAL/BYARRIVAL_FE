import { router } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "@/components/header/header";

// TODO: UT 범위에서는 화면 이동만 확인하는 빈 화면
export function SmalltalkScreen() {
  const { top } = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: top }}>
      <Header title="스몰토크" onBack={() => router.back()} />
    </View>
  );
}
