import { create } from "zustand";

import type { Time } from "@/components/time-picker/time-picker";
import type { RegionResponse } from "@/types/user/user.types";

/** 이동 유형. 여기서 고른 값이 이후 화면 문구·캐릭터를 바꾼다 (화면설계서 ONB-05 · 98_유형별 변형) */
export type UserType = "worker" | "student" | "other";

/** 관심 뉴스 분야 8개 (Figma 온보딩_수정_최최종 Step5 · 마이 관심 카테고리 공통) */
export type Interest =
  | "economy"
  | "health"
  | "entertainment"
  | "politics"
  | "science"
  | "tech"
  | "global"
  | "sports";

/** 직군 코드 12종 (화면설계서 ONB-09, users.job_group) */
export type JobGroup =
  | "planning_marketing"
  | "hr_legal"
  | "finance_accounting"
  | "it_data"
  | "design"
  | "sales_service"
  | "manufacturing_logistics"
  | "medical"
  | "research_education"
  | "media_culture"
  | "public_welfare"
  | "etc";

type OnboardingDraft = {
  nickname: string;
  userType: UserType | null;
  /** 가장 일찍 출발하는 날의 출발 시각 (24시간제) */
  departureTime: Time;
  /** 이동하는 동안 뉴스를 읽을 수 있는 시간(분) */
  travelMinutes: number;
  /** 고른 관심 분야. 고른 순서를 유지한다 */
  interests: Interest[];
  /** 직군. 학생은 희망 직군을 같은 코드로 저장한다 */
  jobGroup: JobGroup | null;
  /** 근무(통학·이동) 지역. 서버 목록(GET /regions)에서 고른 시/군/구 */
  region: RegionResponse | null;
};

type OnboardingState = OnboardingDraft & {
  /** 온보딩을 끝까지 마쳤는지. 마치기 전에는 홈 쪽 화면에 들어갈 수 없다 */
  isOnboarded: boolean;
  /** 서버에 저장된 값으로 초안을 채운다 (중간 이탈 후 이어서 진행) */
  hydrate: (draft: Partial<OnboardingDraft>) => void;
  setNickname: (nickname: string) => void;
  setUserType: (userType: UserType) => void;
  setDepartureTime: (departureTime: Time) => void;
  setTravelMinutes: (travelMinutes: number) => void;
  toggleInterest: (interest: Interest) => void;
  setJobGroup: (jobGroup: JobGroup) => void;
  setRegion: (region: RegionResponse | null) => void;
  completeOnboarding: () => void;
  /** 로그아웃 · 탈퇴 시 처음 상태로 (다음 사용자에게 이전 값이 보이지 않게) */
  reset: () => void;
};

const INITIAL: OnboardingDraft & { isOnboarded: boolean } = {
  nickname: "",
  userType: null,
  // 화면설계서 ONB-06 기본값 08:00
  departureTime: { hour: 8, minute: 0 },
  // 화면설계서 ONB-07 기본값 30분
  travelMinutes: 30,
  interests: [],
  jobGroup: null,
  region: null,
  // TODO: 로그인 연동 후 서버의 온보딩 완료 여부로 대체 (지금은 앱을 켤 때마다 온보딩부터 시작)
  isOnboarded: false,
};

// 단계마다 서버에 저장하고, 화면 사이에서는 이 초안으로 값을 넘긴다 (뒤로 가도 유지)
export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...INITIAL,
  hydrate: (draft) => set(draft),
  setNickname: (nickname) => set({ nickname }),
  setUserType: (userType) => set({ userType }),
  setDepartureTime: (departureTime) => set({ departureTime }),
  setTravelMinutes: (travelMinutes) => set({ travelMinutes }),
  toggleInterest: (interest) =>
    set(({ interests }) => ({
      interests: interests.includes(interest)
        ? interests.filter((item) => item !== interest)
        : [...interests, interest],
    })),
  setJobGroup: (jobGroup) => set({ jobGroup }),
  setRegion: (region) => set({ region }),
  completeOnboarding: () => set({ isOnboarded: true }),
  reset: () => set(INITIAL),
}));
