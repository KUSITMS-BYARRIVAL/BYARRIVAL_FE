import { Pressable, type PressableProps, Text, View } from "react-native";

import { ArrowRightLIcon } from "@/assets/icons";
import { cn } from "@/lib/cn";
import { SEMANTIC } from "@/theme/colors";

type RankingRowProps = Omit<PressableProps, "children"> & {
  rank: number;
  title: string;
  /** 제목 아래 보조 문구 (예: 경제 · 2분 · 12,840명 읽음) */
  subtext: string;
  /** 실시간 문구면 초록 점과 brand 색으로 표시한다 (예: 지금 128명이 보고 있어요) */
  isLive?: boolean;
  hasArrow?: boolean;
  /** 순위 원 색  Mono(회색) · Brand(초록) */
  rankTone?: "mono" | "brand";
  /** 제목 최대 줄 수. 넘치면 말줄임(…). 없으면 줄 수 제한 없음 */
  titleNumberOfLines?: number;
  className?: string;
};

export function RankingRow({
  rank,
  title,
  subtext,
  isLive = false,
  hasArrow = true,
  rankTone = "mono",
  titleNumberOfLines,
  className,
  ...props
}: RankingRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={cn("bg-white px-5 py-4", className)}
      {...props}
    >
      {({ pressed }) => (
        <>
          {pressed && <View className="absolute inset-0 bg-btn-pressed" />}
          <View className="gap-1">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 flex-row items-center gap-2">
                {/* Figma 순위 원은 1~3만 그림으로 있어 순위와 상관없이 쓰도록 원과 숫자로 그린다 */}
                <View
                  className={cn(
                    "size-6 items-center justify-center rounded-full",
                    rankTone === "brand"
                      ? "bg-green-500"
                      : "bg-icon-background",
                  )}
                >
                  <Text
                    className={cn(
                      "text-label2-sb",
                      rankTone === "brand"
                        ? "text-on-fill-default"
                        : "text-secondary",
                    )}
                  >
                    {rank}
                  </Text>
                </View>
                <Text
                  numberOfLines={titleNumberOfLines}
                  // Figma 최대 너비 245는 화살표 자리를 남긴 값이라, 화살표가 없으면 끝까지 쓴다
                  className={cn(
                    "flex-1 text-strong text-body2-m",
                    hasArrow && "max-w-[245px]",
                  )}
                >
                  {title}
                </Text>
              </View>
              {hasArrow && (
                <ArrowRightLIcon color={SEMANTIC.icon["on-fill-muted"]} />
              )}
            </View>
            <View className="flex-row items-center gap-2 pl-8">
              {isLive && <View className="size-2 rounded-full bg-green-500" />}
              <Text
                className={cn(
                  "flex-1 text-caption1-r",
                  isLive ? "text-brand" : "text-tertiary",
                )}
              >
                {subtext}
              </Text>
            </View>
          </View>
        </>
      )}
    </Pressable>
  );
}
