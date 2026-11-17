// Swagger 스키마 그대로 (도메인 코드 user: User · Onboarding · Terms · Category · Region 태그)

export type TravelType = "WORKER" | "STUDENT" | "ETC";

export type RegionResponse = {
  sidoId: number;
  sidoName: string;
  sigunguId: number;
  sigunguName: string;
};

export type OnboardingResponse = {
  nickname: string | null;
  travelType: TravelType | null;
  /** HH:mm */
  commuteStartTime: string | null;
  defaultCommuteMinutes: number | null;
  // 입력 전에는 값이 없을 수 있다 (Swagger에 nullable 표기 없음)
  categoryIds: number[] | null;
  jobGroups: string[] | null;
  region: RegionResponse | null;
  onboardingCompleted: boolean;
};

/** 보낸 항목만 바뀐다 */
export type OnboardingUpdateRequest = Partial<{
  nickname: string;
  travelType: TravelType;
  commuteStartTime: string;
  defaultCommuteMinutes: number;
  categoryIds: number[];
  jobGroups: string[];
  sigunguId: number;
}>;

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

/** 이동하는 요일 하나. 보내지 않은 요일은 이동하지 않는 날 */
export type DailyCommute = {
  dayOfWeek: DayOfWeek;
  /** HH:mm */
  startTime: string;
  /** 5~120분, 5분 단위 */
  minutes: number;
};

export type UserMeResponse = {
  userId: number;
  nickname: string | null;
  profileImageUrl: string | null;
  termsAgreed: boolean;
  onboardingCompleted: boolean;
  travelType: TravelType | null;
  defaultCommuteMinutes: number | null;
  /** 이동하는 요일만 월요일부터 */
  weeklyCommute: DailyCommute[] | null;
  categoryIds: number[] | null;
  jobGroups: string[] | null;
  region: RegionResponse | null;
};

/** 닉네임 · 이동 유형 · 기본 이동시간 중 보낸 항목만 바뀐다 */
export type UserUpdateRequest = Partial<{
  nickname: string;
  travelType: TravelType;
  defaultCommuteMinutes: number;
}>;

/** OS 알림 권한 결과 (PUT /users/me/notification-permission) */
export type NotificationPermission = "GRANTED" | "DENIED";

export type TermsType = "SERVICE" | "PRIVACY";

export type TermsResponse = {
  termsId: number;
  type: TermsType;
  title: string;
  version: string;
  /** 약관 본문 주소 */
  contentUrl: string;
  required: boolean;
};

/** 필수 약관에 모두 동의해야 받는다 */
export type TermsAgreementRequest = {
  agreements: { termsId: number; agreed: boolean }[];
};

export type CategoryResponse = { id: number; name: string };

export type SigunguResponse = { sigunguId: number; name: string };

export type RegionSidoResponse = {
  sidoId: number;
  name: string;
  fullName: string;
  sigungus: SigunguResponse[];
};
