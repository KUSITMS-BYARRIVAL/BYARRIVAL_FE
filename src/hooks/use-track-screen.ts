import { useGlobalSearchParams, usePathname } from "expo-router";
import { useEffect } from "react";

import { posthog } from "@/lib/analytics";

/** 루트 가드가 여는 라우트 그룹: 비로그인 · 온보딩 전 · 온보딩 완료 */
export type ScreenGroup = "auth" | "onboarding" | "app";

// 그룹별 경로 → PostHog 화면 이름. 이름 규칙 · 출처는 docs/analytics_events.md 「화면 이름」
const SCREEN_NAMES: Record<ScreenGroup, Record<string, string>> = {
  auth: {
    "/intro": "onboarding_intro",
    "/sign-in": "onboarding_login",
  },
  onboarding: {
    "/terms": "onboarding_terms",
    "/nickname": "onboarding_nickname",
    "/user-type": "onboarding_situation",
    "/departure-time": "onboarding_commute_start",
    "/travel-time": "onboarding_commute_time",
    "/interests": "onboarding_category",
    "/job-group": "onboarding_job",
    "/region": "onboarding_region",
    "/complete": "onboarding_complete",
  },
  app: {
    "/": "home",
    "/notifications": "notifications",
    "/trending": "top10",
    "/smalltalk": "smalltalk",
    "/ride/condition": "route_condition",
    "/ride/select": "route_pick_cards",
    "/ride/boarding-pass": "route_boarding_pass",
    "/ride/stop": "route_stop",
    "/ride/arrival": "arrival",
    "/quiz": "quiz",
    "/quiz/result": "quiz_result",
    "/archive": "saved_article",
    "/my": "my",
    "/profile": "my_settings",
    "/profile/travel-time": "my_commute_time",
    "/profile/departure-time": "my_commute_start",
    "/profile/user-type": "my_situation",
    "/profile/job-group": "my_job",
    "/profile/region": "my_region",
    "/profile/interests": "my_category",
  },
};

const findGroup = (pathname: string) =>
  (Object.keys(SCREEN_NAMES) as ScreenGroup[]).find(
    (group) => pathname in SCREEN_NAMES[group],
  );

/**
 * 경로가 바뀔 때마다 화면 진입을 기록한다. `openGroup`이 null인 동안(첫 화면이 정해지기 전)은 보내지 않는다
 * 가드가 그룹을 닫으면 이동 직전 한 번 그 그룹의 첫 화면 경로(예: 로그아웃 시 `/`)를 거치므로, 열린 그룹이 아닌 경로는 건너뛴다
 */
export function useTrackScreen(openGroup: ScreenGroup | null) {
  const pathname = usePathname();
  const { tab } = useGlobalSearchParams<{ tab?: string }>();
  const group = findGroup(pathname);
  // 보관함은 탭이 경로가 아니라 파라미터라 따로 나눈다. 표에 없는 경로는 빠뜨려도 기록되도록 경로 그대로 보낸다
  const name =
    pathname === "/archive" && tab === "smalltalk"
      ? "saved_smalltalk"
      : group
        ? SCREEN_NAMES[group][pathname]
        : pathname;
  const isVisible =
    openGroup !== null && (group === undefined || group === openGroup);

  useEffect(() => {
    if (isVisible) posthog.screen(name);
  }, [isVisible, name]);
}
