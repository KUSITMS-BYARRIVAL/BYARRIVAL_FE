import { router } from "expo-router";
import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "@/components/header/header";
import { cn } from "@/lib/cn";

type SettingsLayoutProps = {
  title: string;
  children: ReactNode;
  /** 본문 ScrollView 안쪽 간격 (기본 gap 없음) */
  contentClassName?: string;
  /** 바텀시트처럼 화면 위에 겹쳐 띄울 요소 */
  overlay?: ReactNode;
};

// Figma 마이 - 설정 하위 화면 공통 틀: 뒤로가기 헤더 + 여백 20px 본문
export function SettingsLayout({
  title,
  children,
  contentClassName,
  overlay,
}: SettingsLayoutProps) {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-default" style={{ paddingTop: top }}>
      <Header title={title} onBack={router.back} />
      <ScrollView
        contentContainerClassName={cn("p-5", contentClassName)}
        contentContainerStyle={{ paddingBottom: Math.max(bottom, 30) }}
      >
        {children}
      </ScrollView>
      {overlay}
    </View>
  );
}
