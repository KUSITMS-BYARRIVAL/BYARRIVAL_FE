import type { ReactNode } from "react";
import { Pressable, type PressableProps, Text, View } from "react-native";

import { cn } from "@/lib/cn";

type ConditionCardProps = Omit<PressableProps, "children"> & {
  /** 왼쪽 50px 곰 얼굴 */
  face: ReactNode;
  /** 이름 옆 20px 날씨 아이콘 */
  weatherIcon: ReactNode;
  weather: string;
  name: string;
  description: string;
  isSelected?: boolean;
  className?: string;
};

// Figma Condition Card. 컨디션 선택 화면에서만 쓰여 ride/_components에 둔다
export function ConditionCard({
  face,
  weatherIcon,
  weather,
  name,
  description,
  isSelected = false,
  className,
  accessibilityState,
  ...props
}: ConditionCardProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ ...accessibilityState, checked: isSelected }}
      className={cn(
        "flex-row items-center gap-3 rounded border px-5 py-4",
        isSelected
          ? "border-brand bg-card-green"
          : "border-white bg-card-white",
        className,
      )}
      {...props}
    >
      {face}
      <View className="flex-1 gap-1">
        <View>
          <Text className="text-tertiary text-caption1-m">{weather}</Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-primary text-title3-sb">{name}</Text>
            {weatherIcon}
          </View>
        </View>
        <Text className="text-secondary text-body3-m">{description}</Text>
      </View>
    </Pressable>
  );
}
