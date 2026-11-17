import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { act, createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";

import { useUpdateNotificationPermission } from "../use-update-notification-permission";

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

describe("useUpdateNotificationPermission", () => {
  it("PUT /users/me/notification-permission에 권한 결과를 보낸다", async () => {
    api
      .onPut("/users/me/notification-permission")
      .reply(200, { data: { permission: "DENIED" } });
    const { result } = await renderHook(
      () => useUpdateNotificationPermission(),
      { wrapper },
    );

    await act(() => result.current.mutateAsync("DENIED"));

    expect(JSON.parse(api.history.put[0]!.data)).toEqual({
      permission: "DENIED",
    });
  });
});
