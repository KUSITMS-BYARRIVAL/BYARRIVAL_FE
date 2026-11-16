import type { Time } from "@/components/time-picker/time-picker";
import type { JobGroup, UserType } from "@/stores/onboarding-store";

import type { TravelType } from "./user.types";

const TRAVEL_TYPES: Record<UserType, TravelType> = {
  worker: "WORKER",
  student: "STUDENT",
  other: "ETC",
};

// 앱 코드는 화면설계서 기준이라 서버 코드(API 명세 USER-14 참고)와 이름이 다른 것이 있다
const JOB_GROUP_CODES: Record<JobGroup, string> = {
  planning_marketing: "PLANNING_MARKETING",
  hr_legal: "HR_ADMIN_LEGAL",
  finance_accounting: "FINANCE_ACCOUNTING",
  it_data: "IT_DATA",
  design: "DESIGN",
  sales_service: "SALES_SERVICE",
  manufacturing_logistics: "MANUFACTURING_LOGISTICS",
  medical: "MEDICAL",
  research_education: "RESEARCH_EDUCATION",
  media_culture: "MEDIA_CULTURE_SPORTS",
  public_welfare: "PUBLIC_WELFARE",
  etc: "ETC_FREELANCE",
};

const invert = <K extends string, V extends string>(record: Record<K, V>) =>
  Object.fromEntries(
    Object.entries(record).map(([key, value]) => [value, key]),
  ) as Record<V, K>;

const USER_TYPES = invert(TRAVEL_TYPES);
const JOB_GROUPS = invert(JOB_GROUP_CODES);

export const toTravelType = (userType: UserType) => TRAVEL_TYPES[userType];
export const fromTravelType = (travelType: TravelType) =>
  USER_TYPES[travelType];

export const toJobGroupCode = (jobGroup: JobGroup) => JOB_GROUP_CODES[jobGroup];
/** 앱에 없는 코드면 undefined */
export const fromJobGroupCode = (code: string): JobGroup | undefined =>
  JOB_GROUPS[code];

const pad = (value: number) => String(value).padStart(2, "0");

export const toHHmm = ({ hour, minute }: Time) => `${pad(hour)}:${pad(minute)}`;
export const fromHHmm = (value: string): Time => {
  const [hour, minute] = value.split(":").map(Number);
  return { hour: hour!, minute: minute! };
};
