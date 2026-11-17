import type { Time } from "@/components/time-picker/time-picker";
import { fromHHmm, toHHmm } from "@/types/user/user.mappers";
import type { DailyCommute } from "@/types/user/user.types";

import { DEFAULT_DEPARTURE, WEEKDAYS, type Weekday } from "./_constants";

/** 요일 하나의 이동 계획. minutes 0이면 쉬는 날(서버에 보내지 않는 요일) */
export type DayPlan = { minutes: number; time: Time };
export type WeeklyPlan = Record<Weekday, DayPlan>;

const toMinutes = ({ hour, minute }: Time) => hour * 60 + minute;

/** 이동하는 요일 중 가장 이른 출근 시각. 없으면 기본값 */
export function earliestTime(plan: WeeklyPlan): Time {
  const times = WEEKDAYS.map(({ value }) => plan[value])
    .filter(({ minutes }) => minutes > 0)
    .map(({ time }) => time);
  if (times.length === 0) return DEFAULT_DEPARTURE;
  return times.reduce((a, b) => (toMinutes(b) < toMinutes(a) ? b : a));
}

/** 서버의 이동하는 요일 목록 → 7일 계획. 쉬는 날의 시각은 가장 이른 시각으로 채운다 */
export function toWeeklyPlan(days: DailyCommute[] | null): WeeklyPlan {
  const byCode = new Map((days ?? []).map((day) => [day.dayOfWeek, day]));
  const plan = Object.fromEntries(
    WEEKDAYS.map(({ value, code }) => {
      const day = byCode.get(code);
      return [
        value,
        day
          ? { minutes: day.minutes, time: fromHHmm(day.startTime) }
          : { minutes: 0, time: DEFAULT_DEPARTURE },
      ];
    }),
  ) as WeeklyPlan;
  const base = earliestTime(plan);
  for (const { value } of WEEKDAYS) {
    if (plan[value].minutes === 0) plan[value] = { minutes: 0, time: base };
  }
  return plan;
}

/** 7일 계획 → 서버 요청 (이동하는 요일만) */
export const toDailyCommutes = (plan: WeeklyPlan): DailyCommute[] =>
  WEEKDAYS.filter(({ value }) => plan[value].minutes > 0).map(
    ({ value, code }) => ({
      dayOfWeek: code,
      startTime: toHHmm(plan[value].time),
      minutes: plan[value].minutes,
    }),
  );

/** 기본 출근 시각을 바꾸면 쉬는 날을 포함한 모든 요일 시각을 한 번에 바꾼다 */
export const withAllTimes = (plan: WeeklyPlan, time: Time): WeeklyPlan =>
  Object.fromEntries(
    WEEKDAYS.map(({ value }) => [value, { ...plan[value], time }]),
  ) as WeeklyPlan;
