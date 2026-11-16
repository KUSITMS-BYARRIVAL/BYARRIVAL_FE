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

export type CategoryResponse = { id: number; name: string };

export type SigunguResponse = { sigunguId: number; name: string };

export type RegionSidoResponse = {
  sidoId: number;
  name: string;
  fullName: string;
  sigungus: SigunguResponse[];
};
