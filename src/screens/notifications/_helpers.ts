import type { NotificationItem } from "@/types/notification/notification.types";

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
