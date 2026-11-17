import type { DayOfWeek } from "@/types/user/user.types";

export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

// 요일별 설정 화면(이동 시간·출근 시간)에서 함께 쓰는 요일 순서와 라벨 · 서버 요일 코드
export const WEEKDAYS: { value: Weekday; label: string; code: DayOfWeek }[] = [
  { value: "mon", label: "월", code: "MONDAY" },
  { value: "tue", label: "화", code: "TUESDAY" },
  { value: "wed", label: "수", code: "WEDNESDAY" },
  { value: "thu", label: "목", code: "THURSDAY" },
  { value: "fri", label: "금", code: "FRIDAY" },
  { value: "sat", label: "토", code: "SATURDAY" },
  { value: "sun", label: "일", code: "SUNDAY" },
];

// 서버 요일별 이동시간 범위 (PUT /users/me/weekly-commute: 5~120분, 5분 단위). 화면은 기획대로 90분까지
export const MINUTE_STEP = 5;
export const MAX_MINUTES = 90;

// 이동하는 요일이 없을 때 보여줄 기본 출근 시각 (온보딩 기본값과 같다)
export const DEFAULT_DEPARTURE = { hour: 8, minute: 0 };
