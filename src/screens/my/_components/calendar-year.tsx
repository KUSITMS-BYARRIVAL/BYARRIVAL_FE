import { View } from "react-native";

import { cn } from "@/lib/cn";

import { CalendarCell, type CalendarStatus } from "./calendar-cell";
import { CalendarHeader } from "./calendar-header";

const MONTH_ROWS = [
  [1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12],
];

type CalendarYearProps = {
  year: number;
  /** 월(1~12) → 상태. 없는 달은 before */
  monthStatuses?: Partial<Record<number, CalendarStatus>>;
  /** 이번 달이 이 해에 있을 때만 월을 넘긴다 */
  currentMonth?: number;
  onPrevYear: () => void;
  onNextYear: () => void;
  className?: string;
};

export function CalendarYear({
  year,
  monthStatuses = {},
  currentMonth,
  onPrevYear,
  onNextYear,
  className,
}: CalendarYearProps) {
  return (
    // 칸 크기·간격은 고정하고 기기 너비 차이는 좌우 여백이 흡수하도록 가운데 정렬한다
    <View
      className={cn("w-full items-center rounded bg-white py-5", className)}
    >
      <View className="gap-3">
        <CalendarHeader
          title={`${year}년`}
          prevLabel="이전 해"
          nextLabel="다음 해"
          onPrev={onPrevYear}
          onNext={onNextYear}
        />
        {MONTH_ROWS.map((row) => (
          <View key={row[0]} className="flex-row gap-2">
            {row.map((month) => (
              <CalendarCell
                // 같은 칸을 재사용하면 해 이동 후 배경이 새로 붙을 때 둥근 모서리가 빠져서 해마다 새로 그린다
                key={`${year}-${month}`}
                label={`${month}월`}
                status={monthStatuses[month]}
                isToday={month === currentMonth}
                className="h-12 w-[45.5px]"
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
