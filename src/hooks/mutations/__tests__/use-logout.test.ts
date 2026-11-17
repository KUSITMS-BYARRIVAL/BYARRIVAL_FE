import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import * as SecureStore from "expo-secure-store";
import { act, createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";

import { useLogout } from "../use-logout";

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
  jest.clearAllMocks();
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

const logout = async () => {
  const { result } = await renderHook(() => useLogout(), { wrapper });
  await act(() => result.current.mutateAsync());
  return result;
};

describe("useLogout", () => {
  it("refreshToken을 body에 담아 POST /auth/logout을 요청한다", async () => {
    api.onPost("/auth/logout").reply(200, { data: null });

    await logout();

    expect(JSON.parse(api.history.post[0]!.data)).toEqual({
      refreshToken: "refresh",
    });
  });

  it("서버 폐기에 성공하면 세션을 비운다", async () => {
    api.onPost("/auth/logout").reply(200, { data: null });

    await logout();

    expect(useAuthStore.getState().refreshToken).toBeNull();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("tokens");
  });

  it("서버 폐기에 실패해도 성공으로 끝나고 세션을 비운다", async () => {
    api.onPost("/auth/logout").reply(500, { code: "SERVER", message: "오류" });

    const result = await logout();

    expect(result.current.isSuccess).toBe(true);
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().refreshToken).toBeNull();
  });

  it("refreshToken이 없으면 요청 없이 세션만 비운다", async () => {
    useAuthStore.setState({ accessToken: "access", refreshToken: null });

    await logout();

    expect(api.history.post).toHaveLength(0);
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});
