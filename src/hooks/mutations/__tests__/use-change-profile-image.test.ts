import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { act, createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";
import type { UserMeResponse } from "@/types/user/user.types";

import { useChangeProfileImage } from "../use-change-profile-image";

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

describe("useChangeProfileImage", () => {
  it("PUT /users/me/profile-image에 image 파트를 multipart로 보낸다", async () => {
    api.onPut("/users/me/profile-image").reply(200, { data: me });
    const { result } = await renderHook(() => useChangeProfileImage(), {
      wrapper,
    });

    await act(() =>
      result.current.mutateAsync({
        uri: "file:///photo.jpg",
        mimeType: "image/jpeg",
      }),
    );

    const request = api.history.put[0]!;
    expect(request.data).toBeInstanceOf(FormData);
    expect(request.headers?.["Content-Type"]).toBe("multipart/form-data");
  });

  it("성공하면 바뀐 사진이 담긴 응답으로 내 정보 캐시를 교체한다", async () => {
    const updated = { ...me, profileImageUrl: "https://cdn.test/me.jpg" };
    queryClient.setQueryData(["user", "getMe"], me);
    api.onPut("/users/me/profile-image").reply(200, { data: updated });
    const { result } = await renderHook(() => useChangeProfileImage(), {
      wrapper,
    });

    await act(() =>
      result.current.mutateAsync({
        uri: "file:///p.png",
        mimeType: "image/png",
      }),
    );

    expect(queryClient.getQueryData(["user", "getMe"])).toEqual(updated);
  });
});
