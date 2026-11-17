import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { act, createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";
import { ApiError } from "@/types/api";

import { useRestoreScrap } from "../use-restore-scrap";

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

// 활성(구독 중) 쿼리를 만들고 첫 조회가 끝날 때까지 기다린다
async function observe(queryKey: string[]) {
  const queryFn = jest.fn().mockResolvedValue("data");
  await renderHook(() => useQuery({ queryKey, queryFn }), { wrapper });
  await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(1));
  return queryFn;
}

describe("useRestoreScrap", () => {
  it("POST /scraps/{scrapId}/restore로 요청한다", async () => {
    api.onPost("/scraps/7/restore").reply(200, { data: null });
    const { result } = await renderHook(() => useRestoreScrap(), { wrapper });

    await act(() => result.current.mutateAsync(7));

    expect(api.history.post[0]!.url).toBe("/scraps/7/restore");
  });

  it("성공하면 scrap 쿼리를 무효화하고 다시 조회한다", async () => {
    const queryFn = await observe(["scrap", "getLibrary"]);
    api.onPost("/scraps/7/restore").reply(200, { data: null });
    const { result } = await renderHook(() => useRestoreScrap(), { wrapper });

    await act(() => result.current.mutateAsync(7));

    await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2));
  });

  it("실패해도 scrap 쿼리를 무효화하고 다시 조회한다", async () => {
    const queryFn = await observe(["scrap", "getLibrary"]);
    api
      .onPost("/scraps/7/restore")
      .reply(409, { code: "CONFLICT", message: "복구 불가" });
    const { result } = await renderHook(() => useRestoreScrap(), { wrapper });

    await act(() => result.current.mutateAsync(7).catch(() => undefined));

    await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2));
  });

  it("실패하면 ApiError로 reject된다", async () => {
    api
      .onPost("/scraps/7/restore")
      .reply(409, { code: "CONFLICT", message: "복구 불가" });
    const { result } = await renderHook(() => useRestoreScrap(), { wrapper });

    await act(() => result.current.mutateAsync(7).catch(() => undefined));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(result.current.error).toMatchObject({
      status: 409,
      code: "CONFLICT",
    });
  });
});
