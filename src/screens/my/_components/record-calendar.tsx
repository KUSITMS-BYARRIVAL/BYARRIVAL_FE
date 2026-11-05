import { useState } from "react";
import { View } from "react-native";

import { SegmentedControl } from "@/components/segmented-control/segmented-control";

import type { CalendarStatus } from "./calendar-cell";
import { CalendarMonth } from "./calendar-month";
import { CalendarYear } from "./calendar-year";

const PERIOD_OPTIONS = [
  { value: "month", label: "이번 달" },
  { value: "year", label: "이번 년도" },
];

type RecordCalendarProps = {
  /** "연-월"(예: "2026-11") → 일 → 상태 */
  dayStatusesByMonth: Record<string, Partial<Record<number, CalendarStatus>>>;
  /** 연 → 월 → 상태 */
  monthStatusesByYear: Record<number, Partial<Record<number, CalendarStatus>>>;
};

export function RecordCalendar({
  dayStatusesByMonth,
  monthStatusesByYear,
}: RecordCalendarProps) {
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth() + 1;

  const [period, setPeriod] = useState("month");
  // 달 이동은 연도를 넘나들므로 연·월을 한 값(0부터 센 달 수)으로 둔다
  const [monthIndex, setMonthIndex] = useState(thisYear * 12 + thisMonth - 1);
  const [year, setYear] = useState(thisYear);
  const viewYear = Math.floor(monthIndex / 12);
  const viewMonth = (monthIndex % 12) + 1;
  const isThisMonth = viewYear === thisYear && viewMonth === thisMonth;

  return (
    <View className="gap-3.5">
      <SegmentedControl
        options={PERIOD_OPTIONS}
        value={period}
        onChange={setPeriod}
        className="self-start"
      />
      {period === "month" ? (
        <CalendarMonth
          year={viewYear}
          month={viewMonth}
          dayStatuses={dayStatusesByMonth[`${viewYear}-${viewMonth}`]}
          today={isThisMonth ? now.getDate() : undefined}
          onPrevMonth={() => setMonthIndex((i) => i - 1)}
          onNextMonth={() => setMonthIndex((i) => i + 1)}
        />
      ) : (
        <CalendarYear
          year={year}
          monthStatuses={monthStatusesByYear[year]}
          currentMonth={year === thisYear ? thisMonth : undefined}
          onPrevYear={() => setYear((y) => y - 1)}
          onNextYear={() => setYear((y) => y + 1)}
        />
      )}
    </View>
  );
}
