import type { ReactNode } from "react";
import { View } from "react-native";

import { cn } from "@/lib/cn";

type TimeSettingProps = {
  /** TimeSettingRow 목록 (예: 월~일) */
  children: ReactNode;
  className?: string;
};

// Figma Time_Setting: 흰 카드에 시간 줄을 12px 간격으로 쌓는다
export function TimeSetting({ children, className }: TimeSettingProps) {
  return (
    <View className={cn("gap-3 rounded bg-white p-5", className)}>
      {children}
    </View>
  );
}
