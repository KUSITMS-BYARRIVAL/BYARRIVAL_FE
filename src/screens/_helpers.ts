import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";

import { INTERESTS, JOB_GROUPS } from "@/screens/_constants";
import type { Interest } from "@/stores/onboarding-store";
import type { TodayRoute } from "@/types/ride/ride.types";
import { fromJobGroupCode } from "@/types/user/user.mappers";
import type { CategoryResponse } from "@/types/user/user.types";

// 온보딩 · 마이 관심 분야에서 함께 쓴다
// 서버 카테고리는 id·이름만 주므로 이름을 앱 선택지(아이콘이 붙은 8개)의 title과 맞춰 짝짓는다
const titleOf = (interest: Interest) =>
  INTERESTS.find(({ value }) => value === interest)?.title;

export const toCategoryIds = (
  interests: Interest[],
  categories: CategoryResponse[],
) =>
  interests.flatMap((interest) => {
    const category = categories.find(({ name }) => name === titleOf(interest));
    return category ? [category.id] : [];
  });

export const toInterests = (
  ids: number[] | null,
  categories: CategoryResponse[],
) =>
  (ids ?? []).flatMap((id) => {
    const name = categories.find((category) => category.id === id)?.name;
    const interest = INTERESTS.find(({ title }) => title === name)?.value;
    return interest ? [interest] : [];
  });

// 홈 · 공감대 전체보기 칩 라벨. 직군 코드가 없으면 전체 칩이다
export const toPopularChipLabel = (jobGroupCode: string | null) => {
  if (!jobGroupCode) return "전체";
  const jobGroup = fromJobGroupCode(jobGroupCode);
  const title = JOB_GROUPS.find(({ value }) => value === jobGroup)?.title;
  return `내 직군 · ${title ?? jobGroupCode}`;
};

// 서버가 준 주소라도 https 원문만 연다 (스킴은 대소문자를 가리지 않는다)
export const openArticle = (url: string) => {
  if (/^https:\/\//i.test(url)) WebBrowser.openBrowserAsync(url);
};

// 홈 탑승 버튼 · 노선 알림을 누를 때 함께 쓴다
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
        // 정거장 화면이 서버의 이어서 볼 정거장(currentStop)부터 연다
        onPress: () => router.push("/ride/stop"),
      };
    }
    // TODO: 지금은 임시로 도착 화면
    case "COMPLETED":
      return {
        label: "오늘의 노선 돌아보기",
        onPress: () => router.push("/ride/arrival"),
      };
    // [임시] EMPTY(오늘 추천 기사 0건) · EXPIRED 문구 — 기획 확인 전
    default:
      return { label: "기사가 없어요!", onPress: undefined };
  }
};
