import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { SettingsLayout } from "./settings-layout";

type WeeklySettingsLayoutProps = {
  title: string;
  /** 맨 위 '기본' 줄 */
  base: ReactNode;
  /** 요일별 줄을 담은 흰 카드 */
  children: ReactNode;
  /** 바텀시트처럼 화면 위에 겹쳐 띄울 요소 */
  overlay?: ReactNode;
};

// Figma 마이 - 설정(요일별 이동 시간·출근 시간): 기본 줄 + '요일별 설정' 카드
export function WeeklySettingsLayout({
  title,
  base,
  children,
  overlay,
}: WeeklySettingsLayoutProps) {
  return (
    <SettingsLayout title={title} contentClassName="gap-9" overlay={overlay}>
      {base}
      <View className="gap-2">
        <Text
          accessibilityRole="header"
          className="text-primary text-title3-sb"
        >
          요일별 설정
        </Text>
        {children}
      </View>
    </SettingsLayout>
  );
}
