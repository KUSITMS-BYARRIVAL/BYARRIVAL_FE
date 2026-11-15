import { router } from "expo-router";
import type { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "@/components/header/header";

type WeeklySettingsLayoutProps = {
  title: string;
  /** 맨 위 '기본' 줄 */
  base: ReactNode;
  /** 흰 카드 안 요일별 줄 */
  children: ReactNode;
};

// Figma 마이 - 설정(요일별 이동 시간·출근 시간): 기본 줄 + '요일별 설정' 카드
export function WeeklySettingsLayout({
  title,
  base,
  children,
}: WeeklySettingsLayoutProps) {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-default" style={{ paddingTop: top }}>
      <Header title={title} onBack={router.back} />
      <ScrollView
        contentContainerClassName="gap-9 p-5"
        contentContainerStyle={{ paddingBottom: Math.max(bottom, 30) }}
      >
        {base}
        <View className="gap-2">
          <Text
            accessibilityRole="header"
            className="text-primary text-title3-sb"
          >
            요일별 설정
          </Text>
          <View className="gap-3 rounded bg-white p-5">{children}</View>
        </View>
      </ScrollView>
    </View>
  );
}
