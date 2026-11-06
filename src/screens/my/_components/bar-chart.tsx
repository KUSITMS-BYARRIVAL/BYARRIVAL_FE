import { Text, View } from "react-native";

import { cn } from "@/lib/cn";

import { getBarHeight } from "./helpers";

type BarChartProps = {
  /** 오래된 주 → 이번 주 순서의 읽은 시간(분). 마지막이 이번 주, 최대 6개 */
  weeklyMinutes: number[];
  className?: string;
};

export function BarChart({ weeklyMinutes, className }: BarChartProps) {
  const maxMinutes = Math.max(0, ...weeklyMinutes);
  const lastIndex = weeklyMinutes.length - 1;

  return (
    // 막대 너비·간격은 고정하고 주 수에 따라 남는 폭은 좌우 여백이 흡수하도록 가운데 정렬한다
    <View className={cn("w-full items-center", className)}>
      <View className="flex-row items-end gap-[11px]">
        {weeklyMinutes.map((minutes, index) => {
          const isThisWeek = index === lastIndex;
          // 라벨은 처음·끝 칸만. 나머지도 빈 줄을 둬야 막대 바닥선이 맞는다
          const label = isThisWeek
            ? "이번주"
            : index === 0
              ? `${lastIndex}주 전`
              : " ";

          return (
            <View key={index} className="w-[42px] items-center gap-1">
              <Text
                className={cn(
                  "text-caption1-m",
                  isThisWeek ? "text-brand" : "text-tertiary",
                )}
              >
                {minutes}
              </Text>
              <View
                className={cn(
                  "w-full rounded-t-sm",
                  isThisWeek ? "bg-green-500" : "bg-icon-background",
                )}
                style={{ height: getBarHeight(minutes, maxMinutes) }}
              />
              <Text
                className={cn(
                  "text-caption1-m",
                  isThisWeek ? "text-brand" : "text-tertiary",
                )}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
