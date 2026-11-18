import type { NotificationItem } from "@/types/notification/notification.types";

import { formatNotificationTime, groupNotifications } from "../_helpers";

// 기기 시간대 기준으로 비교하도록 시간대 없는 ISO 문자열을 쓴다
const NOW = new Date("2026-11-18T15:00:00");

const item = (id: number, createdAt: string): NotificationItem => ({
  id,
  type: "TEST",
  title: "제목",
  body: "본문",
  params: {},
  read: false,
  createdAt,
});

describe("groupNotifications", () => {
  it("오늘 0시 이후는 오늘, 최근 7일은 이번 주, 그 전은 이전으로 나눈다", () => {
    const groups = groupNotifications(
      [
        item(1, "2026-11-18T00:00:00"),
        item(2, "2026-11-17T23:59:00"),
        item(3, "2026-11-12T09:00:00"),
        item(4, "2026-11-11T00:00:00"),
        item(5, "2026-11-10T23:59:00"),
      ],
      NOW,
    );

    expect(
      groups.map((group) => [group.title, group.data.map(({ id }) => id)]),
    ).toEqual([
      ["오늘", [1]],
      ["이번 주", [2, 3, 4]],
      ["이전", [5]],
    ]);
  });

  it("알림이 없는 그룹은 뺀다", () => {
    const groups = groupNotifications([item(1, "2026-11-10T09:00:00")], NOW);

    expect(groups.map((group) => group.title)).toEqual(["이전"]);
  });
});

describe("formatNotificationTime", () => {
  it.each([
    ["2026-11-18T14:59:30", "방금"],
    ["2026-11-18T14:55:00", "5분 전"],
    ["2026-11-18T12:00:00", "3시간 전"],
    ["2026-11-18T00:10:00", "14시간 전"],
    ["2026-11-17T23:00:00", "11월 17일"],
  ])("%s → %s", (createdAt, expected) => {
    expect(formatNotificationTime(createdAt, NOW)).toBe(expected);
  });
});
