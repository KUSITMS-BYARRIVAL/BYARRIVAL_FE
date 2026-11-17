import { useGetMe } from "@/hooks/queries/use-get-me";
import { COMMUTE_WORDS } from "@/screens/_constants";
import type { UserType } from "@/stores/onboarding-store";
import type { TravelType } from "@/types/user/user.types";

const USER_TYPE_BY_TRAVEL_TYPE: Record<TravelType, UserType> = {
  WORKER: "worker",
  STUDENT: "student",
  ETC: "other",
};

// 내 정보를 불러오기 전에는 직장인 문구를 보여준다
export function useCommuteWords() {
  const { data: me } = useGetMe();
  return COMMUTE_WORDS[USER_TYPE_BY_TRAVEL_TYPE[me?.travelType ?? "WORKER"]];
}
