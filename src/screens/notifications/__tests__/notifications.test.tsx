import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { router } from "expo-router";

import { baseApi } from "@/lib/api-client";
import { useToastStore } from "@/stores/toast-store";
import type { NotificationItem } from "@/types/notification/notification.types";

import { NotificationsScreen } from "../notifications";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({
  router: { push: jest.fn(), navigate: jest.fn(), back: jest.fn() },
}));
jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

const api = new MockAdapter(baseApi);
let queryClient: QueryClient;

const item = (
  id: number,
  overrides: Partial<NotificationItem> = {},
): NotificationItem => ({
  id,
  type: "ROUTE_READY",
  title: `알림 ${id}`,
  body: `본문 ${id}`,
  params: {},
  read: false,
  createdAt: "2026-11-18T14:55:00",
  ...overrides,
});

const page = (
  notifications: NotificationItem[],
  next?: number,
): { data: unknown } => ({
  data: { notifications, nextCursor: next ?? 0, hasNext: next !== undefined },
});

const renderScreen = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <NotificationsScreen />
    </QueryClientProvider>,
  );

beforeEach(() => {
  // advanceTimers: 현재 시각만 고정하고 타이머는 실제처럼 흐르게 한다 (쿼리 · waitFor 동작용)
  jest.useFakeTimers({
    now: new Date("2026-11-18T15:00:00"),
    advanceTimers: true,
  });
  jest.clearAllMocks();
  api.reset();
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false, gcTime: Infinity },
    },
  });
  api.onGet("/notifications/unread-count").reply(200, { data: { count: 1 } });
});

afterEach(() => {
  useToastStore.getState().hideToast();
  queryClient.clear();
  jest.useRealTimers();
});

describe("NotificationsScreen", () => {
  it("createdAt으로 그룹을 나누고 받은 시간 문구를 보여준다", async () => {
    api
      .onGet("/notifications")
      .reply(
        200,
        page([item(1), item(2, { createdAt: "2026-11-15T09:00:00" })]),
      );

    await renderScreen();

    expect(await screen.findByText("알림 1")).toBeOnTheScreen();
    expect(screen.getByText("오늘")).toBeOnTheScreen();
    expect(screen.getByText("5분 전")).toBeOnTheScreen();
    expect(screen.getByText("이번 주")).toBeOnTheScreen();
    expect(screen.getByText("11월 15일")).toBeOnTheScreen();
    expect(screen.queryByText("이전")).toBeNull();
    expect(api.history.get[0]!.params).toEqual({ size: 20 });
  });

  it("안 읽은 알림을 누르면 읽음 처리하고 유형별 화면으로 이동한다", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    api
      .onGet("/notifications")
      .reply(200, page([item(7, { type: "STREAK_MILESTONE" })]));
    api.onPatch("/notifications/7/read").reply(200, { data: null });

    await renderScreen();
    await user.press(await screen.findByText("알림 7"));

    expect(router.navigate).toHaveBeenCalledWith("/my");
    await waitFor(() => expect(api.history.patch).toHaveLength(1));
    expect(api.history.patch[0]!.url).toBe("/notifications/7/read");
  });

  it("이미 읽은 알림은 읽음 요청 없이 이동만 한다", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    api
      .onGet("/notifications")
      .reply(200, page([item(7, { read: true, type: "SMALLTALK" })]));

    await renderScreen();
    await user.press(await screen.findByText("알림 7"));

    expect(router.push).toHaveBeenCalledWith("/smalltalk");
    expect(api.history.patch).toHaveLength(0);
  });

  it("'모두 읽음'을 누르면 전부 읽음 처리 후 토스트를 띄우고 목록 · 개수를 다시 불러온다", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    api.onGet("/notifications").reply(200, page([item(1)]));
    api.onPatch("/notifications/read-all").reply(200, { data: null });

    await renderScreen();
    await screen.findByText("알림 1");
    const button = screen.getByRole("button", { name: "모두 읽음" });
    await waitFor(() => expect(button).toBeEnabled());
    await user.press(button);

    await waitFor(() =>
      expect(useToastStore.getState().toast?.message).toBe(
        "모두 읽음 처리했어요",
      ),
    );
    await waitFor(() =>
      expect(
        api.history.get.filter((req) => req.url === "/notifications"),
      ).toHaveLength(2),
    );
    expect(
      api.history.get.filter(
        (req) => req.url === "/notifications/unread-count",
      ),
    ).toHaveLength(2);
  });

  it("안 읽은 알림이 0개면 '모두 읽음'이 비활성이다", async () => {
    api.onGet("/notifications/unread-count").reply(200, { data: { count: 0 } });
    api.onGet("/notifications").reply(200, page([item(1, { read: true })]));

    await renderScreen();
    await screen.findByText("알림 1");

    expect(screen.getByRole("button", { name: "모두 읽음" })).toBeDisabled();
  });

  it("알림이 없으면 빈 화면 문구를 보여준다", async () => {
    api.onGet("/notifications").reply(200, page([]));

    await renderScreen();

    expect(
      await screen.findByText("아직 받은 알림이 없어요"),
    ).toBeOnTheScreen();
  });
});
