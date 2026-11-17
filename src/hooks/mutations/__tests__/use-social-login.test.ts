import { act } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { ApiError } from "@/types/api";

import { useSocialLogin } from "../use-social-login";

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
  useAuthStore.setState({ accessToken: null, refreshToken: null });
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

const loggedIn = {
  userId: 1,
  isNewUser: false,
  termsAgreed: true,
  onboardingCompleted: true,
  accessToken: "access-1",
  refreshToken: "refresh-1",
};

describe("useSocialLogin", () => {
  it("POST /auth/login으로 요청 body를 그대로 전달한다", async () => {
    api.onPost("/auth/login").reply(200, { data: loggedIn });
    const { result } = await renderHook(() => useSocialLogin(), { wrapper });

    await act(() =>
      result.current.mutateAsync({ provider: "KAKAO", token: "kakao-token" }),
    );

    expect(JSON.parse(api.history.post[0]!.data)).toEqual({
      provider: "KAKAO",
      token: "kakao-token",
    });
  });

  it("성공하면 응답의 토큰을 auth-store에 저장한다", async () => {
    api.onPost("/auth/login").reply(200, { data: loggedIn });
    const { result } = await renderHook(() => useSocialLogin(), { wrapper });

    await act(() =>
      result.current.mutateAsync({ provider: "KAKAO", token: "kakao-token" }),
    );

    expect(useAuthStore.getState()).toMatchObject({
      accessToken: "access-1",
      refreshToken: "refresh-1",
    });
  });

  it("약관 미동의 회원이면 약관 동의 전으로 세션을 저장한다", async () => {
    api.onPost("/auth/login").reply(200, {
      data: { ...loggedIn, termsAgreed: false, onboardingCompleted: false },
    });
    const { result } = await renderHook(() => useSocialLogin(), { wrapper });

    await act(() =>
      result.current.mutateAsync({ provider: "KAKAO", token: "kakao-token" }),
    );

    expect(useAuthStore.getState()).toMatchObject({
      isOnboarded: false,
      isTermsAgreed: false,
    });
  });

  it("401 응답이면 ApiError로 실패하고 토큰은 저장되지 않는다", async () => {
    api
      .onPost("/auth/login")
      .reply(401, { code: "INVALID_TOKEN", message: "유효하지 않은 토큰" });
    const { result } = await renderHook(() => useSocialLogin(), { wrapper });

    await act(() =>
      result.current
        .mutateAsync({ provider: "APPLE", token: "bad" })
        .catch(() => undefined),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});
