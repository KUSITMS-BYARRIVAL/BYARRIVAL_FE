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
    case "CREATED":
    case "BOARDING":
    case "IN_PROGRESS": {
      // 운행 전(CREATED · BOARDING)에는 진행 정보가 없다
      const ride = todayRoute?.route?.ride;
      return {
        label: ride
          ? `이어서 탑승하기 (${ride.currentStop}/${ride.totalStops})`
          : "이어서 탑승하기",
        // TODO: CREATED · BOARDING의 이동 화면(카드 선택 · 보딩패스)은 탑승 플로우 API 연동 때 맞춘다
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
