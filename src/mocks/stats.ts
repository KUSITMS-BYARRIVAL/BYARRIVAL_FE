import type { CalendarStatus } from "@/screens/my/_components/calendar-cell";

export const TOTAL_HOURS = 142;
export const MONTH_MINUTES = 60 * 60 + 32;
export const MONTH_READ_COUNT = 37;

export const DAY_STATUSES_BY_MONTH: Record<
  string,
  Partial<Record<number, CalendarStatus>>
> = {
  "2026-10": {
    1: "attendance",
    2: "complete",
    5: "attendance",
    6: "complete",
    7: "attendance",
    8: "complete",
    9: "offday",
    12: "complete",
    13: "complete",
    14: "offday", // 연차
    15: "attendance",
    16: "complete",
    19: "complete",
    20: "complete",
    21: "attendance",
    22: "complete",
    23: "complete",
    26: "complete",
    27: "complete",
    28: "complete",
    29: "complete",
    30: "complete",
  },
  "2026-11": {
    2: "complete",
    3: "complete",
    4: "attendance",
    5: "complete",
    6: "complete",
  },
};

export const MONTH_STATUSES_BY_YEAR: Record<
  number,
  Partial<Record<number, CalendarStatus>>
> = {
  2026: {
    1: "attendance",
    2: "attendance",
    3: "complete",
    4: "attendance",
    5: "complete",
    6: "complete",
    7: "attendance",
    8: "complete",
    9: "complete",
    10: "complete",
    11: "complete",
  },
};

// 6주 전 → 이번 주 순서의 읽은 시간(분). 지난주 대비 +30분
export const WEEKLY_MINUTES = [42, 55, 61, 74, 88, 118];
