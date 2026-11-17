import { act } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";
import { ApiError } from "@/types/api";

import { useCompleteOnboarding } from "../use-complete-onboarding";

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

const completed = {
  nickname: "홍길동",
  travelType: "WORKER",
  commuteStartTime: "08:00",
  defaultCommuteMinutes: 30,
  categoryIds: [1],
  jobGroups: ["IT_DATA"],
  region: null,
  onboardingCompleted: true,
};

describe("useCompleteOnboarding", () => {
  it("POST /users/me/onboarding/complete를 body 없이 호출한다", async () => {
    api.onPost("/users/me/onboarding/complete").reply(200, { data: completed });
    const { result } = await renderHook(() => useCompleteOnboarding(), {
      wrapper,
    });

    await act(() => result.current.mutateAsync());

    expect(api.history.post).toHaveLength(1);
    expect(api.history.post[0]!.data).toBeUndefined();
  });

  it("성공하면 응답 data를 온보딩 조회 캐시에 반영한다", async () => {
    api.onPost("/users/me/onboarding/complete").reply(200, { data: completed });
    const { result } = await renderHook(() => useCompleteOnboarding(), {
      wrapper,
    });

    await act(() => result.current.mutateAsync());

    expect(queryClient.getQueryData(["user", "getOnboarding"])).toEqual(
      completed,
    );
  });

  it("409 응답이면 ApiError로 실패한다", async () => {
    api
      .onPost("/users/me/onboarding/complete")
      .reply(409, { code: "CONFLICT", message: "이미 완료" });
    const { result } = await renderHook(() => useCompleteOnboarding(), {
      wrapper,
    });

    await act(() => result.current.mutateAsync().catch(() => undefined));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(result.current.error).toMatchObject({
      status: 409,
      code: "CONFLICT",
    });
  });
});
