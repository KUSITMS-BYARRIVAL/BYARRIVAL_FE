import type { StripLevel } from "@/screens/my/_components/year-strips-card";

export const TOTAL_HOURS = 142;
export const MONTH_MINUTES = 60 * 60 + 32;
export const MONTH_READ_COUNT = 37;

// 5주 전 → 이번 주 순서의 읽은 시간(분). 지난주 대비 +30분
export const WEEKLY_MINUTES = [42, 55, 61, 74, 88, 118];
// shortcut: 증감 표현·전달 형식(숫자/문구)이 미정이라 고정값, API 연결 시 응답 형식에 맞춰 교체
export const LAST_WEEK_DIFF_MINUTES = 30;

export const RECORD_SUMMARY = {
  year: 2026,
  streakDays: 7,
  readCount: 128,
  readHours: 24,
  longestStreakDays: 15,
};

const STRIP_LEVEL_PATTERN: StripLevel[] = [
  "complete",
  "partial",
  "visit",
  "partial",
  "none",
  "complete",
  "partial",
];

// 2026-01-01 ~ 2026-11-13 평일에 패턴을 돌려 채운 잔디 목데이터
export const STRIP_LEVELS: Record<string, StripLevel> = {};
for (
  let date = new Date(2026, 0, 1), i = 0;
  date <= new Date(2026, 10, 13);
  date.setDate(date.getDate() + 1)
) {
  if (date.getDay() === 0 || date.getDay() === 6) continue;
  const key = `2026-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  STRIP_LEVELS[key] = STRIP_LEVEL_PATTERN[i++ % STRIP_LEVEL_PATTERN.length];
}

export const CONDITION_COUNTS = {
  sunny: 62,
  default: 54,
  cloudy: 32,
  rain: 16,
};
// [임시] 기간이 올해인지 이번 달인지 미정
export const CONDITION_MESSAGE =
  "올해는 맑은 날이 가장 많았어요!\n컨디션이 좋아 보여요";
