import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { cn } from "@/lib/cn";

type ButtonCardProps = {
  /** 있으면 카드 위에 초록 제목과 구분선을 둔다 (Figma Button Card-title) */
  title?: string;
  /** RankingRow · ListRow 등 행 목록 */
  children: ReactNode;
  className?: string;
};

export function ButtonCard({ title, children, className }: ButtonCardProps) {
  return (
    <View className={cn("overflow-hidden rounded bg-white", className)}>
      {title && (
        <View className="px-5 pt-3">
          <View className="border-b border-default pb-2">
            <Text
              accessibilityRole="header"
              className="text-brand text-body2-m"
            >
              {title}
            </Text>
          </View>
        </View>
      )}
      {children}
    </View>
  );
}
