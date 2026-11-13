import type { UserType } from "@/stores/onboarding-store";

// 사용자 유형별로 '출근' · '출근길' · '직장인' 문구를 바꾼다
export const COMMUTE_WORDS: Record<
  UserType,
  { commute: string; route: string; person: string }
> = {
  worker: { commute: "출근", route: "출근길", person: "직장인" },
  student: { commute: "등교", route: "등굣길", person: "학생" },
  other: { commute: "이동", route: "이동길", person: "유저" },
};
