import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { act, createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";

import { useArrive } from "../use-arrive";

jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

const api = new MockAdapter(baseApi);

let queryClient: QueryClient;
const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: queryClient }, children);

beforeEach(() => {
  api.reset();
  queryClient = new QueryClient({
    defaultOptions: {
      // gcTime Infinity: 정리 타이머가 Jest 종료를 막지 않게 한다
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false, gcTime: Infinity },
    },
  });
});

afterEach(() => {
  queryClient.clear();
});

describe("useArrive", () => {
  it("POST /routes/{routeId}/arrival로 요청하고 완주 결과를 반환한다", async () => {
    const arrival = { routeId: 7, readCount: 3, streakDays: 2, top3: null };
    api.onPost("/routes/7/arrival").reply(200, { data: arrival });
    const { result } = await renderHook(() => useArrive(), { wrapper });

    let data: unknown;
    await act(async () => {
      data = await result.current.mutateAsync(7);
    });

    expect(api.history.post[0]!.url).toBe("/routes/7/arrival");
    expect(data).toEqual(arrival);
  });

  it("성공하면 오늘 노선 · 홈 · 통계를 모두 무효화한다", async () => {
    queryClient.setQueryData(["ride", "getToday"], "today");
    queryClient.setQueryData(["ride", "getHome"], "home");
    queryClient.setQueryData(["stats", "getStreak"], "streak");
    api.onPost("/routes/7/arrival").reply(200, { data: { routeId: 7 } });
    const { result } = await renderHook(() => useArrive(), { wrapper });

    await act(() => result.current.mutateAsync(7));

    expect(queryClient.getQueryState(["ride", "getToday"])?.isInvalidated).toBe(
      true,
    );
    expect(queryClient.getQueryState(["ride", "getHome"])?.isInvalidated).toBe(
      true,
    );
    expect(
      queryClient.getQueryState(["stats", "getStreak"])?.isInvalidated,
    ).toBe(true);
  });

  it("실패하면(안 읽은 기사 남음) 캐시를 무효화하지 않는다", async () => {
    queryClient.setQueryData(["ride", "getToday"], "today");
    api
      .onPost("/routes/7/arrival")
      .reply(409, { code: "ROUTE_NOT_ARRIVABLE", message: "도착 불가" });
    const { result } = await renderHook(() => useArrive(), { wrapper });

    await act(() => result.current.mutateAsync(7).catch(() => undefined));

    expect(queryClient.getQueryState(["ride", "getToday"])?.isInvalidated).toBe(
      false,
    );
  });
});
