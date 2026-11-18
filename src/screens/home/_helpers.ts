import { router } from "expo-router";

import type { TodayRoute } from "@/types/ride/ride.types";

// TODO: 쉬는 날(프로필 0분) '오늘은 쉬는 날이에요. 그래도 읽어볼까요?' 상태 (UT 이후)
export const getRideButton = (todayRoute: TodayRoute | null) => {
  switch (todayRoute?.state ?? "NONE") {
    case "NONE":
      return {
        label: "뉴스 탑승 시작하기",
        onPress: () => router.push("/ride/condition"),
      };
    // 출발 전에는 아직 고르는 중이라 마지막 단계(카드 선택 · 탑승권)로 돌아간다
    case "CREATED":
      return {
        label: "이어서 탑승하기",
        onPress: () => router.push("/ride/select"),
      };
    case "BOARDING":
      return {
        label: "이어서 탑승하기",
        onPress: () => router.push("/ride/boarding-pass"),
      };
    case "IN_PROGRESS": {
      const ride = todayRoute?.route?.ride;
      return {
        label: ride
          ? `이어서 탑승하기 (${ride.currentStop}/${ride.totalStops})`
          : "이어서 탑승하기",
        onPress: () =>
          router.push({
            pathname: "/ride/stop",
            // currentStop은 1부터, start는 0부터 센다
            params: ride ? { start: ride.currentStop - 1 } : {},
          }),
      };
    }
    // TODO: 지금은 임시로 도착 화면
    case "COMPLETED":
      return {
        label: "오늘 노선 다시 보기",
        onPress: () => router.push("/ride/arrival"),
      };
    // [임시] EMPTY(오늘 추천 기사 0건) · EXPIRED 문구 — 기획 확인 전
    default:
      return { label: "기사가 없어요!", onPress: undefined };
  }
};
