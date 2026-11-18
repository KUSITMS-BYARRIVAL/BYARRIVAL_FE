import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { act, createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";

import { useGetNotifications } from "../use-get-notifications";

jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

const api = new MockAdapter(baseApi);

let queryClient: QueryClient;
const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: queryClient }, children);

const page = (ids: number[], nextCursor: number, hasNext: boolean) => ({
  data: {
    notifications: ids.map((id) => ({ id })),
    nextCursor,
    hasNext,
  },
});

beforeEach(() => {
  api.reset();
  queryClient = new QueryClient({
    defaultOptions: {
      // gcTime Infinity: 정리 타이머가 Jest 종료를 막지 않게 한다
      queries: { retry: false, gcTime: Infinity },
    },
  });
});

afterEach(() => {
  queryClient.clear();
});

describe("useGetNotifications", () => {
  it("첫 페이지는 cursor 없이 20개, 다음 페이지는 nextCursor로 요청해 이어 붙인다", async () => {
    api
      .onGet("/notifications")
      .reply(({ params }) =>
        params.cursor === 31
          ? [200, page([30], 0, false)]
          : [200, page([50, 31], 31, true)],
      );
    const { result } = await renderHook(() => useGetNotifications(), {
      wrapper,
    });
    await waitFor(() => expect(result.current.hasNextPage).toBe(true));

    await act(() => result.current.fetchNextPage());

    expect(api.history.get.map((req) => req.params)).toEqual([
      { size: 20 },
      { cursor: 31, size: 20 },
    ]);
    await waitFor(() =>
      expect(
        result.current.data?.pages.flatMap((p) =>
          p.notifications.map(({ id }) => id),
        ),
      ).toEqual([50, 31, 30]),
    );
    expect(result.current.hasNextPage).toBe(false);
  });

  it("hasNext가 false면 nextCursor 값과 상관없이 다음 페이지가 없다", async () => {
    api.onGet("/notifications").reply(200, page([1], 1, false));
    const { result } = await renderHook(() => useGetNotifications(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.hasNextPage).toBe(false);
  });
});
