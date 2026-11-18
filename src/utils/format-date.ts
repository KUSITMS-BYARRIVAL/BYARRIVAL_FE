const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 예: 10월 10일 토요일 */
export const formatMonthDayWeekday = (date: Date) =>
  `${date.getMonth() + 1}월 ${date.getDate()}일 ${WEEKDAYS[date.getDay()]}요일`;

const pad = (value: number) => String(value).padStart(2, "0");

/** 예: 2026.11.04 (기기 시간대 기준) */
export const formatDotDate = (date: Date) =>
  `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
