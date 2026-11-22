import { router } from "expo-router";

import { getTodayRouteQuery } from "@/hooks/queries/use-get-today-route";
import { queryClient } from "@/lib/query-client";
import { openArticle } from "@/screens/_helpers";
import { getRideButton } from "@/screens/home/_helpers";
import type { NotificationItem } from "@/types/notification/notification.types";

/**
 * 알림함 항목 · OS 푸시를 눌렀을 때 유형과 params로 화면을 연다.
 * 모르는 유형이거나 필요한 params가 없으면 알림함으로 보낸다 (유형 · 키가 늘어도 앱이 깨지지 않게)
 */
export async function openNotification(
  type: string,
  params: Record<string, string>,
) {
  switch (type) {
    // 노선은 사람마다 하나라 id 없이 지금 상태를 다시 받아 홈 탑승 버튼과 같은 곳으로 보낸다
    case "ROUTE_READY":
    case "ROUTE_INCOMPLETE":
    case "STREAK_BREAK": {
      // 실패해도 홈으로 보내고 홈이 다시 조회하므로 여기서는 토스트를 띄우지 않는다
      const todayRoute = await queryClient
        .fetchQuery({ ...getTodayRouteQuery(), meta: { skipToast: true } })
        .catch(() => null);
      // getRideButton은 null을 시작 전으로 보므로 조회 실패는 먼저 걸러 홈으로 보낸다
      const onPress = todayRoute && getRideButton(todayRoute).onPress;
      // 만료 · 기사 없음처럼 갈 곳이 없어도 홈
      return onPress ? onPress() : router.navigate("/");
    }
    case "STREAK_MILESTONE":
      return router.navigate("/my");
    // 스몰토크 상세 화면이 없어 목록으로 보낸다
    case "SMALLTALK":
      return router.push("/smalltalk");
    case "POPULAR_ARTICLE":
      if (params.url) return openArticle(params.url);
      break;
    // 공지사항 페이지가 없어 홈으로 보낸다
    case "SERVICE_NOTICE":
      return router.navigate("/");
  }
  router.navigate("/notifications");
}

const startOfDay = (date: Date, daysAgo = 0) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() - daysAgo);

/** 최신순 목록을 오늘 / 이번 주(오늘 제외 최근 7일) / 이전으로 나눈다. 빈 그룹은 뺀다 */
export function groupNotifications(list: NotificationItem[], now: Date) {
  const today = startOfDay(now);
  const weekStart = startOfDay(now, 7);
  const groups = [
    { title: "오늘", data: [] as NotificationItem[] },
    { title: "이번 주", data: [] as NotificationItem[] },
    { title: "이전", data: [] as NotificationItem[] },
  ];
  for (const item of list) {
    const createdAt = new Date(item.createdAt);
    const index = createdAt >= today ? 0 : createdAt >= weekStart ? 1 : 2;
    groups[index]!.data.push(item);
  }
  return groups.filter((group) => group.data.length > 0);
}

/** 예: 방금 · 5분 전 · 3시간 전(오늘) · 10월 11일 */
export function formatNotificationTime(createdAt: string, now: Date) {
  const date = new Date(createdAt);
  const minutes = Math.floor((now.getTime() - date.getTime()) / 60_000);
  if (minutes < 1) return "방금";
  if (minutes < 60) return `${minutes}분 전`;
  if (date >= startOfDay(now)) return `${Math.floor(minutes / 60)}시간 전`;
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}
