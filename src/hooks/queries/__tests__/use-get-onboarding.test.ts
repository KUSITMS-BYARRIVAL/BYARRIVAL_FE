import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";
import { ApiError } from "@/types/api";

import { useGetOnboarding } from "../use-get-onboarding";

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

const onboarding = {
  nickname: "홍길동",
  travelType: "WORKER",
  commuteStartTime: "08:00",
  defaultCommuteMinutes: 30,
  categoryIds: [1, 2],
  jobGroups: ["IT_DATA"],
  region: null,
  onboardingCompleted: false,
};

describe("useGetOnboarding", () => {
  it("온보딩 조회 응답의 data를 반환한다", async () => {
    api.onGet("/users/me/onboarding").reply(200, { data: onboarding });

    const { result } = await renderHook(() => useGetOnboarding(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(onboarding);
  });

  it("서버가 500을 주면 ApiError(status, code)로 실패한다", async () => {
    api
      .onGet("/users/me/onboarding")
      .reply(500, { code: "SERVER_ERROR", message: "서버 오류" });

    const { result } = await renderHook(() => useGetOnboarding(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(result.current.error).toMatchObject({
      status: 500,
      code: "SERVER_ERROR",
    });
  });
});
