import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { act, createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";

import { useRemoveCard } from "../use-remove-card";

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

const route = { routeId: 7, status: "CREATED", cards: [] };

describe("useRemoveCard", () => {
  it("DELETE /routes/{routeId}/cart/{articleId}로 요청한다", async () => {
    api.onDelete("/routes/7/cart/11").reply(200, { data: route });
    const { result } = await renderHook(() => useRemoveCard(), { wrapper });

    await act(() => result.current.mutateAsync({ routeId: 7, articleId: 11 }));

    expect(api.history.delete[0]!.url).toBe("/routes/7/cart/11");
  });

  it("성공하면 응답 노선을 오늘 노선 캐시에 상태와 함께 넣는다", async () => {
    api.onDelete("/routes/7/cart/11").reply(200, { data: route });
    const { result } = await renderHook(() => useRemoveCard(), { wrapper });

    await act(() => result.current.mutateAsync({ routeId: 7, articleId: 11 }));

    expect(queryClient.getQueryData(["ride", "getToday"])).toEqual({
      state: "CREATED",
      route,
    });
  });
});
