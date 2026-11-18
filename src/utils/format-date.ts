const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 예: 10월 10일 토요일 */
export const formatMonthDayWeekday = (date: Date) =>
  `${date.getMonth() + 1}월 ${date.getDate()}일 ${WEEKDAYS[date.getDay()]}요일`;
