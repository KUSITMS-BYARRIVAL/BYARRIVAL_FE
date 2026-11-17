export type TravelType = "WORKER" | "STUDENT" | "ETC";

export type Me = {
  userId: number;
  nickname: string;
  profileImageUrl: string;
  termsAgreed: boolean;
  onboardingCompleted: boolean;
  travelType: TravelType;
  defaultCommuteMinutes: number;
  weeklyCommute: {
    dayOfWeek:
      | "MONDAY"
      | "TUESDAY"
      | "WEDNESDAY"
      | "THURSDAY"
      | "FRIDAY"
      | "SATURDAY"
      | "SUNDAY";
    startTime: string;
    minutes: number;
  }[];
  categoryIds: number[];
  jobGroups: string[];
  region: {
    sidoId: number;
    sidoName: string;
    sigunguId: number;
    sigunguName: string;
  };
};
