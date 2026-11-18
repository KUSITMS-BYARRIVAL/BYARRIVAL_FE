import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { act, createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";

import { useSaveCursor } from "../use-save-cursor";

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

describe("useSaveCursor", () => {
  it("PUT /routes/{routeId}/cursor에 카드 순번을 보낸다", async () => {
    api.onPut("/routes/7/cursor").reply(200, { data: null });
    const { result } = await renderHook(() => useSaveCursor(), { wrapper });

    await act(() => result.current.mutateAsync({ routeId: 7, cardOrder: 3 }));

    expect(JSON.parse(api.history.put[0]!.data)).toEqual({ cardOrder: 3 });
  });

  it("성공하면 오늘 노선만 무효화한다", async () => {
    queryClient.setQueryData(["ride", "getToday"], "today");
    queryClient.setQueryData(["ride", "getHome"], "home");
    api.onPut("/routes/7/cursor").reply(200, { data: null });
    const { result } = await renderHook(() => useSaveCursor(), { wrapper });

    await act(() => result.current.mutateAsync({ routeId: 7, cardOrder: 3 }));

    expect(queryClient.getQueryState(["ride", "getToday"])?.isInvalidated).toBe(
      true,
    );
    expect(queryClient.getQueryState(["ride", "getHome"])?.isInvalidated).toBe(
      false,
    );
  });
});
