import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { act, createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";

import { useReadStop } from "../use-read-stop";

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

const progress = {
  totalStops: 3,
  readCount: 2,
  currentStop: 2,
  remainingStops: 1,
  remainingMinutes: 4,
  arrivable: false,
};

describe("useReadStop", () => {
  it("POST /routes/{routeId}/stops/{stopNumber}/read로 요청한다", async () => {
    api.onPost("/routes/7/stops/2/read").reply(200, { data: { progress } });
    const { result } = await renderHook(() => useReadStop(), { wrapper });

    await act(() => result.current.mutateAsync({ routeId: 7, stopNumber: 2 }));

    expect(api.history.post[0]!.url).toBe("/routes/7/stops/2/read");
  });

  it("성공하면 그 정거장 캐시를 완독으로 바꾸고 진행 정보를 넣는다", async () => {
    queryClient.setQueryData(["ride", "getStop", 7, 2], {
      stopNumber: 2,
      read: false,
      progress: null,
    });
    api.onPost("/routes/7/stops/2/read").reply(200, { data: { progress } });
    const { result } = await renderHook(() => useReadStop(), { wrapper });

    await act(() => result.current.mutateAsync({ routeId: 7, stopNumber: 2 }));

    expect(queryClient.getQueryData(["ride", "getStop", 7, 2])).toEqual({
      stopNumber: 2,
      read: true,
      progress,
    });
  });

  it("성공하면 오늘 노선 · 홈을 무효화한다", async () => {
    queryClient.setQueryData(["ride", "getToday"], "today");
    queryClient.setQueryData(["ride", "getHome"], "home");
    api.onPost("/routes/7/stops/2/read").reply(200, { data: { progress } });
    const { result } = await renderHook(() => useReadStop(), { wrapper });

    await act(() => result.current.mutateAsync({ routeId: 7, stopNumber: 2 }));

    expect(queryClient.getQueryState(["ride", "getToday"])?.isInvalidated).toBe(
      true,
    );
    expect(queryClient.getQueryState(["ride", "getHome"])?.isInvalidated).toBe(
      true,
    );
  });

  it("정거장 캐시가 없으면 새로 만들지 않는다", async () => {
    api.onPost("/routes/7/stops/2/read").reply(200, { data: { progress } });
    const { result } = await renderHook(() => useReadStop(), { wrapper });

    await act(() => result.current.mutateAsync({ routeId: 7, stopNumber: 2 }));

    expect(queryClient.getQueryData(["ride", "getStop", 7, 2])).toBeUndefined();
  });
});
