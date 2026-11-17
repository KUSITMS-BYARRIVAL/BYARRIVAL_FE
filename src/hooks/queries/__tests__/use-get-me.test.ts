import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";
import { ApiError } from "@/types/api";

import { useGetMe } from "../use-get-me";

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

describe("useGetMe", () => {
  it("GET /users/me 응답의 data를 반환한다", async () => {
    const me = { userId: 1, nickname: "홍길동" };
    api.onGet("/users/me").reply(200, { data: me });

    const { result } = await renderHook(() => useGetMe(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(me);
  });

  it("서버 에러면 ApiError로 실패한다", async () => {
    api.onGet("/users/me").reply(500, { code: "SERVER", message: "오류" });

    const { result } = await renderHook(() => useGetMe(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(ApiError);
  });
});
