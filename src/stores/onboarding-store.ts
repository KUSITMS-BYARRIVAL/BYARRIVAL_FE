import { create } from "zustand";

import type { Time } from "@/components/time-picker/time-picker";

/** 이동 유형. 여기서 고른 값이 이후 화면 문구·캐릭터를 바꾼다 (화면설계서 ONB-05 · 98_유형별 변형) */
export type UserType = "worker" | "student" | "other";

/** 관심 뉴스 분야 (화면설계서 ONB-08) */
export type Interest =
  | "economy"
  | "tech"
  | "career"
  | "society"
  | "global"
  | "life"
  | "science"
  | "culture";

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

export type Region = { province: string; district: string | null };

type OnboardingState = {
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
  /** 근무(통학·이동) 지역. district가 null이면 시/도 전체 */
  region: Region | null;
  setNickname: (nickname: string) => void;
  setUserType: (userType: UserType) => void;
  setDepartureTime: (departureTime: Time) => void;
  setTravelMinutes: (travelMinutes: number) => void;
  toggleInterest: (interest: Interest) => void;
  setJobGroup: (jobGroup: JobGroup) => void;
  setRegion: (region: Region | null) => void;
};

// 온보딩 단계 사이에 입력값을 넘기고, 뒤로 가도 값이 유지되도록 한곳에 모은다
// TODO: 마지막 단계에서 온보딩 저장 API로 보내고 초기화 (API 명세 확정 후)
export const useOnboardingStore = create<OnboardingState>((set) => ({
  nickname: "",
  userType: null,
  // 화면설계서 ONB-06 기본값 08:00
  departureTime: { hour: 8, minute: 0 },
  // 화면설계서 ONB-07 기본값 30분
  travelMinutes: 30,
  interests: [],
  jobGroup: null,
  region: null,
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
}));
