import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { act, createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";
import { ApiError } from "@/types/api";

import { useCreateRoute } from "../use-create-route";

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

const todayRoute = { state: "CREATED", route: { routeId: 7 } };

describe("useCreateRoute", () => {
  it("POST /routes에 고른 컨디션을 보낸다", async () => {
    api.onPost("/routes").reply(200, { data: todayRoute });
    const { result } = await renderHook(() => useCreateRoute(), { wrapper });

    await act(() => result.current.mutateAsync("CLOUDY"));

    expect(JSON.parse(api.history.post[0]!.data)).toEqual({
      condition: "CLOUDY",
    });
  });

  it("성공하면 응답을 오늘 노선 캐시에 넣고 홈을 무효화한다", async () => {
    queryClient.setQueryData(["ride", "getHome"], "home");
    api.onPost("/routes").reply(200, { data: todayRoute });
    const { result } = await renderHook(() => useCreateRoute(), { wrapper });

    await act(() => result.current.mutateAsync("SUNNY"));

    expect(queryClient.getQueryData(["ride", "getToday"])).toEqual(todayRoute);
    expect(queryClient.getQueryState(["ride", "getHome"])?.isInvalidated).toBe(
      true,
    );
  });

  it("실패하면 ApiError로 reject되고 캐시는 그대로다", async () => {
    queryClient.setQueryData(["ride", "getHome"], "home");
    api.onPost("/routes").reply(500, { code: "SERVER", message: "오류" });
    const { result } = await renderHook(() => useCreateRoute(), { wrapper });

    await act(() => result.current.mutateAsync("SUNNY").catch(() => undefined));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(queryClient.getQueryData(["ride", "getToday"])).toBeUndefined();
    expect(queryClient.getQueryState(["ride", "getHome"])?.isInvalidated).toBe(
      false,
    );
  });
});
