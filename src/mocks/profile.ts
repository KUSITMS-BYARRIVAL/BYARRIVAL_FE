import type { UserType } from "@/stores/onboarding-store";

// 내 정보 API 응답 자리. 값은 임시값이다
export const MY_PROFILE: { userType: UserType; jobGroup: string } = {
  userType: "worker",
  jobGroup: "마케팅",
};
