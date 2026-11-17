import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { act, createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";
import { queryClient as globalQueryClient } from "@/lib/query-client";
import { useAuthStore } from "@/stores/auth-store";

import { useWithdraw } from "../use-withdraw";

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
  useAuthStore.setState({ accessToken: "access", refreshToken: "refresh" });
});

afterEach(() => {
  queryClient.clear();
});

// clearSession이 비우는 전역 캐시의 gc 타이머가 Jest 종료를 막지 않게 한다
afterAll(() => globalQueryClient.clear());

describe("useWithdraw", () => {
  it("DELETE /users/me를 요청한다", async () => {
    api.onDelete("/users/me").reply(200, { data: null });
    const { result } = await renderHook(() => useWithdraw(), { wrapper });

    await act(() => result.current.mutateAsync());

    expect(api.history.delete).toHaveLength(1);
  });

  it("성공하면 세션을 비운다", async () => {
    api.onDelete("/users/me").reply(200, { data: null });
    const { result } = await renderHook(() => useWithdraw(), { wrapper });

    await act(() => result.current.mutateAsync());

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().refreshToken).toBeNull();
  });

  it("실패하면 세션을 유지한다", async () => {
    api.onDelete("/users/me").reply(500, { code: "SERVER", message: "오류" });
    const { result } = await renderHook(() => useWithdraw(), { wrapper });

    await act(() => result.current.mutateAsync().catch(() => undefined));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(useAuthStore.getState().accessToken).toBe("access");
    expect(useAuthStore.getState().refreshToken).toBe("refresh");
  });
});
