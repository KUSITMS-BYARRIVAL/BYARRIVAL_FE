import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { act, createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";
import { ApiError } from "@/types/api";
import type { UserMeResponse } from "@/types/user/user.types";

import { useUpdateMe } from "../use-update-me";

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

describe("useUpdateMe", () => {
  it("PATCH /users/me로 수정 항목를 body로 전달한다", async () => {
    api.onPatch("/users/me").reply(200, { data: me });
    const { result } = await renderHook(() => useUpdateMe(), { wrapper });

    await act(() => result.current.mutateAsync({ nickname: "홍길동" }));

    expect(JSON.parse(api.history.patch[0]!.data)).toEqual({
      nickname: "홍길동",
    });
  });

  it("성공하면 응답 data로 내 정보 캐시를 교체한다", async () => {
    queryClient.setQueryData(["user", "getMe"], { ...me, nickname: "이전" });
    api.onPatch("/users/me").reply(200, { data: me });
    const { result } = await renderHook(() => useUpdateMe(), { wrapper });

    await act(() => result.current.mutateAsync({ nickname: "홍길동" }));

    expect(queryClient.getQueryData(["user", "getMe"])).toEqual(me);
  });

  it("400 응답이면 ApiError로 실패하고 기존 캐시는 유지된다", async () => {
    queryClient.setQueryData(["user", "getMe"], me);
    api
      .onPatch("/users/me")
      .reply(400, { code: "INVALID", message: "잘못된 요청" });
    const { result } = await renderHook(() => useUpdateMe(), { wrapper });

    await act(() => result.current.mutateAsync({}).catch(() => undefined));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(result.current.error).toMatchObject({
      status: 400,
      code: "INVALID",
    });
    expect(queryClient.getQueryData(["user", "getMe"])).toEqual(me);
  });
});
