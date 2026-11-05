import { Pressable, Text, View } from "react-native";

import { ArrowLeftSIcon, ArrowRightSIcon } from "@/assets/icons";
import { cn } from "@/lib/cn";
import { SEMANTIC } from "@/theme/colors";

import { CalendarDay, type CalendarDayStatus } from "./calendar-day";
import { getCalendarWeeks } from "./helpers";

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

type CalendarProps = {
  year: number;
  /** 1~12 */
  month: number;
  /** 일 → 상태. 없는 날은 before */
  dayStatuses?: Partial<Record<number, CalendarDayStatus>>;
  /** 오늘이 이 달에 있을 때만 일(day)을 넘긴다 */
  today?: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  className?: string;
};

export function Calendar({
  year,
  month,
  dayStatuses = {},
  today,
  onPrevMonth,
  onNextMonth,
  className,
}: CalendarProps) {
  return (
    // 칸 크기·간격은 고정하고 기기 너비 차이는 좌우 여백이 흡수하도록 가운데 정렬한다
    <View
      className={cn("w-full items-center rounded bg-white py-5", className)}
    >
      <View className="gap-3">
        <View className="flex-row items-center gap-1">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="이전 달"
            onPress={onPrevMonth}
          >
            <ArrowLeftSIcon color={SEMANTIC.icon.primary} />
          </Pressable>
          {/* Figma 스타일명은 Title3/SB지만 값(16px·600)이 title2-sb와 같아 title2-sb를 쓴다 */}
          <Text className="text-primary text-title2-sb">
            {year}년 {month}월
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="다음 달"
            onPress={onNextMonth}
          >
            <ArrowRightSIcon color={SEMANTIC.icon.primary} />
          </Pressable>
        </View>
        <View className="flex-row gap-2">
          {WEEKDAYS.map((weekday) => (
            <Text
              key={weekday}
              className="w-[38px] text-center text-tertiary text-caption1-m"
            >
              {weekday}
            </Text>
          ))}
        </View>
        {getCalendarWeeks(year, month).map((week, weekIndex) => (
          <View key={weekIndex} className="flex-row gap-2">
            {week.map((day, dayIndex) =>
              day === null ? (
                <View key={dayIndex} className="size-[38px]" />
              ) : (
                <CalendarDay
                  key={dayIndex}
                  day={day}
                  status={dayStatuses[day]}
                  isToday={day === today}
                />
              ),
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
