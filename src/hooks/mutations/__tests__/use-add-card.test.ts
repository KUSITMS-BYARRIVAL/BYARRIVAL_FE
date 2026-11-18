import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { act, createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";

import { useAddCard } from "../use-add-card";

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

describe("useAddCard", () => {
  it("PUT /routes/{routeId}/cart/{articleId}로 요청한다", async () => {
    api.onPut("/routes/7/cart/11").reply(200, { data: route });
    const { result } = await renderHook(() => useAddCard(), { wrapper });

    await act(() => result.current.mutateAsync({ routeId: 7, articleId: 11 }));

    expect(api.history.put[0]!.url).toBe("/routes/7/cart/11");
  });

  it("성공하면 응답 노선을 오늘 노선 캐시에 상태와 함께 넣는다", async () => {
    api.onPut("/routes/7/cart/11").reply(200, { data: route });
    const { result } = await renderHook(() => useAddCard(), { wrapper });

    await act(() => result.current.mutateAsync({ routeId: 7, articleId: 11 }));

    expect(queryClient.getQueryData(["ride", "getToday"])).toEqual({
      state: "CREATED",
      route,
    });
  });

  it("실패하면(시간 초과) 오늘 노선 캐시를 바꾸지 않는다", async () => {
    queryClient.setQueryData(["ride", "getToday"], "before");
    api
      .onPut("/routes/7/cart/11")
      .reply(400, { code: "ROUTE_CART_OVER_LIMIT", message: "초과" });
    const { result } = await renderHook(() => useAddCard(), { wrapper });

    await act(() =>
      result.current
        .mutateAsync({ routeId: 7, articleId: 11 })
        .catch(() => undefined),
    );

    expect(queryClient.getQueryData(["ride", "getToday"])).toBe("before");
  });
});
