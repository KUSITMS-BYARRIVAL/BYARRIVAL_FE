import { create } from "zustand";

/** 이동 유형. 여기서 고른 값이 이후 화면 문구·캐릭터를 바꾼다 (화면설계서 ONB-05 · 98_유형별 변형) */
export type UserType = "worker" | "student" | "other";

type OnboardingState = {
  nickname: string;
  userType: UserType | null;
  setNickname: (nickname: string) => void;
  setUserType: (userType: UserType) => void;
};

// 온보딩 단계 사이에 입력값을 넘기고, 뒤로 가도 값이 유지되도록 한곳에 모은다
// TODO: 마지막 단계에서 온보딩 저장 API로 보내고 초기화 (API 명세 확정 후)
export const useOnboardingStore = create<OnboardingState>((set) => ({
  nickname: "",
  userType: null,
  setNickname: (nickname) => set({ nickname }),
  setUserType: (userType) => set({ userType }),
}));
