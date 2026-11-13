const MAX_BAR_HEIGHT = 85;

/** 보이는 주들 중 최댓값이 가장 높은 막대가 되도록 0~최댓값을 0~85px로 비례시킨다 */
export function getBarHeight(minutes: number, maxMinutes: number) {
  return maxMinutes === 0 ? 0 : (minutes / maxMinutes) * MAX_BAR_HEIGHT;
}

export type YearStripColumn = {
  /** 월~금 날짜 키(YYYY-MM-DD). 올해가 아니거나 오늘 이후면 null */
  days: (string | null)[];
  /** 이 주에서 새 달이 시작되면 그 달(1~12) */
  monthLabel?: number;
};

/** 1월 1일부터 오늘까지 평일을 하루씩 돌며 주(월요일 시작) 단위 열로 묶는다 */
export function getYearStripColumns(today: Date) {
  const columns: YearStripColumn[] = [];
  let lastMonth = 0;

  for (
    const date = new Date(today.getFullYear(), 0, 1);
    date <= today;
    date.setDate(date.getDate() + 1)
  ) {
    const weekday = (date.getDay() + 6) % 7;
    if (weekday >= 5) continue;
    if (weekday === 0 || columns.length === 0) {
      columns.push({ days: Array(5).fill(null) });
    }

    const column = columns[columns.length - 1];
    const month = date.getMonth() + 1;
    column.days[weekday] =
      `${date.getFullYear()}-${String(month).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    if (month !== lastMonth) {
      column.monthLabel = month;
      lastMonth = month;
    }
  }
  return columns;
}
