import { useRef } from "react";
import { ScrollView, type ScrollViewInstance, Text, View } from "react-native";

import { cn } from "@/lib/cn";
import type { StripLevel } from "@/screens/my/_constants";

import { getYearStripColumns } from "./helpers";

const LEVEL_CLASS: Record<StripLevel, string> = {
  none: "bg-grey-200",
  visit: "bg-green-200",
  partial: "bg-green-500",
  complete: "bg-green-700",
};

type YearStripsCardProps = {
  /** 날짜 키(YYYY-MM-DD)별 단계. 없는 날은 미접속 */
  levels: Partial<Record<string, StripLevel>>;
  today: Date;
};

export function YearStripsCard({ levels, today }: YearStripsCardProps) {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const columns = getYearStripColumns(today);
  // shortcut: levels 전체를 세서 이전 연도·주말·미래 날짜가 섞이면 잔디와 숫자가 어긋남, API 응답 범위가 정해지면 columns 날짜만 세거나 서버 값으로 교체
  const completeCount = Object.values(levels).filter(
    (level) => level === "complete",
  ).length;

  return (
    <View className="gap-3 rounded bg-white p-5">
      <View className="flex-row items-start justify-between">
        <Text className="text-primary text-title3-sb">
          올해 {completeCount}일 완주했어요
        </Text>
        <Text className="text-tertiary text-caption1-m">평일(월~금) 기준</Text>
      </View>
      {/* 이번 달이 먼저 보이도록 오른쪽 끝에서 시작한다 */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: false })
        }
        contentContainerClassName="gap-[2px]"
      >
        {columns.map(({ days, monthLabel }, i) => (
          <View key={i} className="gap-[2px]">
            {/* 월 글자가 칸(9.6px)보다 넓어 폭을 따로 줘야 줄바꿈되지 않는다 */}
            <View className="h-[17px]">
              {monthLabel && (
                <Text className="absolute left-0 top-0 w-8 text-tertiary text-caption1-m">
                  {monthLabel}월
                </Text>
              )}
            </View>
            {days.map((day, j) => (
              <View
                key={j}
                className={cn(
                  "size-[9.6px] rounded-[2px]",
                  day && LEVEL_CLASS[levels[day] ?? "none"],
                )}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
