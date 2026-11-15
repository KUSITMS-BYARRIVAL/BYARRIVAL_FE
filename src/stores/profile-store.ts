import { create } from "zustand";

import type { Time } from "@/components/time-picker/time-picker";
import type {
  Interest,
  JobGroup,
  Region,
  UserType,
} from "@/stores/onboarding-store";

export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

/** 요일별 값. null이면 그날은 이동하지 않는 날 */
type ByWeekday<T> = Record<Weekday, T>;

type ProfileState = {
  nickname: string;
  userType: UserType;
  jobGroup: JobGroup;
  /** 근무(통학·이동) 지역. null이면 아직 고르지 않음 */
  region: Region | null;
  interests: Interest[];
  /** 기본 이동 시간(분)과 요일별 이동 시간. 0분이면 쉬는 날 */
  travelMinutes: { base: number; byWeekday: ByWeekday<number> };
  /** 기본 출근 시각과 요일별 출근 시각. null이면 쉬는 날 */
  departureTimes: { base: Time; byWeekday: ByWeekday<Time | null> };
  setUserType: (userType: UserType) => void;
  setJobGroup: (jobGroup: JobGroup) => void;
  setRegion: (region: Region | null) => void;
  toggleInterest: (interest: Interest) => void;
  setBaseTravelMinutes: (minutes: number) => void;
  setTravelMinutes: (weekday: Weekday, minutes: number) => void;
  setBaseDepartureTime: (time: Time) => void;
  setDepartureTime: (weekday: Weekday, time: Time) => void;
};

// 마이 > 프로필 설정 값. 바꾸면 프로필 목록에 바로 반영된다
// TODO: 내 정보 조회·수정 API가 나오면 초기값을 응답으로 채우고 setter에서 저장 요청 (지금 값은 Figma 시안 기준 임시값)
export const useProfileStore = create<ProfileState>((set) => ({
  nickname: "출근러",
  userType: "worker",
  jobGroup: "it_data",
  region: { province: "서울", district: "강남구" },
  interests: ["economy", "tech"],
  travelMinutes: {
    base: 30,
    byWeekday: { mon: 30, tue: 30, wed: 30, thu: 40, fri: 50, sat: 0, sun: 0 },
  },
  departureTimes: {
    base: { hour: 8, minute: 0 },
    byWeekday: {
      mon: { hour: 8, minute: 0 },
      tue: { hour: 9, minute: 0 },
      wed: { hour: 10, minute: 0 },
      thu: { hour: 13, minute: 0 },
      fri: { hour: 15, minute: 0 },
      sat: null,
      sun: null,
    },
  },
  setUserType: (userType) => set({ userType }),
  setJobGroup: (jobGroup) => set({ jobGroup }),
  setRegion: (region) => set({ region }),
  toggleInterest: (interest) =>
    set(({ interests }) => ({
      interests: interests.includes(interest)
        ? interests.filter((item) => item !== interest)
        : [...interests, interest],
    })),
  setBaseTravelMinutes: (base) =>
    set(({ travelMinutes }) => ({ travelMinutes: { ...travelMinutes, base } })),
  setTravelMinutes: (weekday, minutes) =>
    set(({ travelMinutes }) => ({
      travelMinutes: {
        ...travelMinutes,
        byWeekday: { ...travelMinutes.byWeekday, [weekday]: minutes },
      },
    })),
  setBaseDepartureTime: (base) =>
    set(({ departureTimes }) => ({
      departureTimes: { ...departureTimes, base },
    })),
  setDepartureTime: (weekday, time) =>
    set(({ departureTimes }) => ({
      departureTimes: {
        ...departureTimes,
        byWeekday: { ...departureTimes.byWeekday, [weekday]: time },
      },
    })),
}));
