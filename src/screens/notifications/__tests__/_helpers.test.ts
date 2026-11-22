import MockAdapter from "axios-mock-adapter";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";

import { baseApi } from "@/lib/api-client";
import { queryClient } from "@/lib/query-client";
import type { NotificationItem } from "@/types/notification/notification.types";

import {
  formatNotificationTime,
  groupNotifications,
  openNotification,
} from "../_helpers";

jest.mock("expo-router", () => ({
  router: { push: jest.fn(), navigate: jest.fn() },
}));
jest.mock("expo-web-browser", () => ({ openBrowserAsync: jest.fn() }));
jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

const api = new MockAdapter(baseApi);

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

describe("openNotification", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.reset();
    queryClient.clear();
  });

  it.each(["ROUTE_READY", "ROUTE_INCOMPLETE", "STREAK_BREAK"])(
    "%s — 오늘 노선을 다시 받아 홈 탑승 버튼과 같은 곳으로 보낸다",
    async (type) => {
      api
        .onGet("/routes/today")
        .reply(200, { data: { state: "NONE", route: null } });
      await openNotification(type, {});
      expect(router.push).toHaveBeenCalledWith("/ride/condition");
    },
  );

  it("노선이 만료돼 갈 곳이 없으면 홈으로 보낸다", async () => {
    api
      .onGet("/routes/today")
      .reply(200, { data: { state: "EXPIRED", route: null } });
    await openNotification("ROUTE_INCOMPLETE", {});
    expect(router.navigate).toHaveBeenCalledWith("/");
  });

  it("오늘 노선 조회에 실패하면 홈으로 보낸다", async () => {
    // 5xx는 전역 설정이 재시도해 느려지므로 재시도하지 않는 4xx로 실패시킨다
    api.onGet("/routes/today").reply(400);
    await openNotification("ROUTE_READY", {});
    expect(router.navigate).toHaveBeenCalledWith("/");
  });

  it("연속 기록 달성은 마이 탭, 스몰토크는 스몰토크 목록으로 보낸다", async () => {
    await openNotification("STREAK_MILESTONE", {});
    await openNotification("SMALLTALK", { smalltalkId: "3" });
    expect(router.navigate).toHaveBeenCalledWith("/my");
    expect(router.push).toHaveBeenCalledWith("/smalltalk");
  });

  it("인기 기사는 params의 url을 인앱 브라우저로 연다", async () => {
    await openNotification("POPULAR_ARTICLE", {
      articleId: "1",
      url: "https://example.com/a",
    });
    expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith(
      "https://example.com/a",
    );
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it.each<[string, Record<string, string>]>([
    ["POPULAR_ARTICLE", {}],
    ["TEST", {}],
    ["UNKNOWN_TYPE", {}],
  ])("%s · params %j — 알림함으로 보낸다", async (type, params) => {
    await openNotification(type, params);
    expect(router.navigate).toHaveBeenCalledWith("/notifications");
  });
});
