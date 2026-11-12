import type { UserType } from "@/stores/onboarding-store";

// 사용자 유형별로 홈의 '출근' · '출근길' 문구를 바꾼다
export const COMMUTE_WORDS: Record<
  UserType,
  { commute: string; route: string }
> = {
  worker: { commute: "출근", route: "출근길" },
  student: { commute: "등교", route: "등굣길" },
  other: { commute: "이동", route: "이동길" },
};
