import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { act, createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";
import type { UserMeResponse } from "@/types/user/user.types";

import { useReplaceInterestCategories } from "../use-replace-interest-categories";

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

const me: UserMeResponse = {
  userId: 1,
  nickname: "홍길동",
  profileImageUrl: null,
  termsAgreed: true,
  onboardingCompleted: true,
  travelType: "STUDENT",
  defaultCommuteMinutes: 40,
  weeklyCommute: null,
  categoryIds: [1],
  jobGroups: ["design"],
  region: null,
};

describe("useReplaceInterestCategories", () => {
  it("PUT /users/me/interest-categories로 카테고리 id를 body로 전달한다", async () => {
    api.onPut("/users/me/interest-categories").reply(200, { data: me });
    const { result } = await renderHook(() => useReplaceInterestCategories(), {
      wrapper,
    });

    await act(() => result.current.mutateAsync([1, 2]));

    expect(JSON.parse(api.history.put[0]!.data)).toEqual({
      categoryIds: [1, 2],
    });
  });

  it("성공하면 응답 data로 내 정보 캐시를 교체한다", async () => {
    queryClient.setQueryData(["user", "getMe"], { ...me, nickname: "이전" });
    api.onPut("/users/me/interest-categories").reply(200, { data: me });
    const { result } = await renderHook(() => useReplaceInterestCategories(), {
      wrapper,
    });

    await act(() => result.current.mutateAsync([1, 2]));

    expect(queryClient.getQueryData(["user", "getMe"])).toEqual(me);
  });
});
