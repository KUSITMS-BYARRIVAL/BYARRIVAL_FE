import { Text, View } from "react-native";

import { cn } from "@/lib/cn";

import { CalendarCell, type CalendarStatus } from "./calendar-cell";
import { CalendarHeader } from "./calendar-header";
import { getCalendarWeeks } from "./helpers";

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

type CalendarMonthProps = {
  year: number;
  /** 1~12 */
  month: number;
  /** 일 → 상태. 없는 날은 before */
  dayStatuses?: Partial<Record<number, CalendarStatus>>;
  /** 오늘이 이 달에 있을 때만 일(day)을 넘긴다 */
  today?: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  className?: string;
};

export function CalendarMonth({
  year,
  month,
  dayStatuses = {},
  today,
  onPrevMonth,
  onNextMonth,
  className,
}: CalendarMonthProps) {
  return (
    // 칸 크기·간격은 고정하고 기기 너비 차이는 좌우 여백이 흡수하도록 가운데 정렬한다
    <View
      className={cn("w-full items-center rounded bg-white py-5", className)}
    >
      <View className="gap-3">
        <CalendarHeader
          title={`${year}년 ${month}월`}
          prevLabel="이전 달"
          nextLabel="다음 달"
          onPrev={onPrevMonth}
          onNext={onNextMonth}
        />
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
                <CalendarCell
                  // 같은 칸을 재사용하면 달 이동 후 배경이 새로 붙을 때 둥근 모서리가 빠져서 날짜마다 새로 그린다
                  key={`${year}-${month}-${day}`}
                  label={String(day)}
                  status={dayStatuses[day]}
                  isToday={day === today}
                  className="size-[38px]"
                />
              ),
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
