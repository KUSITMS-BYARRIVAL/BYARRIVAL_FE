import { router } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "@/components/header/header";

// TODO: UT 범위에서는 화면 이동만 확인하는 빈 화면
export function TrendingScreen() {
  const { top } = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-default" style={{ paddingTop: top }}>
      <Header title="지금 출근길에서 많이 봐요" onBack={router.back} />
    </View>
  );
}
