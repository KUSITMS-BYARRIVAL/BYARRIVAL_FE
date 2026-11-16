import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";

import { useGetRegions } from "../use-get-regions";

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

describe("useGetRegions", () => {
  it("행정구역 목록 응답의 data를 반환한다", async () => {
    const regions = [{ sidoId: 1, sidoName: "서울", sigungus: [] }];
    api.onGet("/regions").reply(200, { data: regions });

    const { result } = await renderHook(() => useGetRegions(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(regions);
  });

  it("같은 QueryClient에서 다시 마운트해도 재요청하지 않는다", async () => {
    api.onGet("/regions").reply(200, { data: [] });

    const first = await renderHook(() => useGetRegions(), { wrapper });
    await waitFor(() => expect(first.result.current.isSuccess).toBe(true));
    first.unmount();
    const second = await renderHook(() => useGetRegions(), { wrapper });
    await waitFor(() => expect(second.result.current.isSuccess).toBe(true));

    expect(api.history.get).toHaveLength(1);
  });
});
