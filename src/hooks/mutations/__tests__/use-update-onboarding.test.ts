import { act } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";
import { ApiError } from "@/types/api";

import { useUpdateOnboarding } from "../use-update-onboarding";

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

const saved = {
  nickname: "홍길동",
  travelType: "STUDENT",
  commuteStartTime: "09:30",
  defaultCommuteMinutes: 40,
  categoryIds: [],
  jobGroups: [],
  region: null,
  onboardingCompleted: false,
};

describe("useUpdateOnboarding", () => {
  it("PATCH /users/me/onboarding로 보낸 항목을 body로 전달한다", async () => {
    api.onPatch("/users/me/onboarding").reply(200, { data: saved });
    const { result } = await renderHook(() => useUpdateOnboarding(), {
      wrapper,
    });

    await act(() => result.current.mutateAsync({ nickname: "홍길동" }));

    expect(JSON.parse(api.history.patch[0]!.data)).toEqual({
      nickname: "홍길동",
    });
  });

  it("성공하면 응답 data를 온보딩 조회 캐시에 반영한다", async () => {
    api.onPatch("/users/me/onboarding").reply(200, { data: saved });
    const { result } = await renderHook(() => useUpdateOnboarding(), {
      wrapper,
    });

    await act(() => result.current.mutateAsync({ nickname: "홍길동" }));

    expect(queryClient.getQueryData(["user", "getOnboarding"])).toEqual(saved);
  });

  it("400 응답이면 ApiError로 실패하고 캐시는 바뀌지 않는다", async () => {
    api
      .onPatch("/users/me/onboarding")
      .reply(400, { code: "INVALID", message: "잘못된 요청" });
    const { result } = await renderHook(() => useUpdateOnboarding(), {
      wrapper,
    });

    await act(() => result.current.mutateAsync({}).catch(() => undefined));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(result.current.error).toMatchObject({
      status: 400,
      code: "INVALID",
    });
    expect(queryClient.getQueryData(["user", "getOnboarding"])).toBeUndefined();
  });
});
