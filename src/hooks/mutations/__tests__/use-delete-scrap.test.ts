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

import { useDeleteScrap } from "../use-delete-scrap";

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

describe("useDeleteScrap", () => {
  it("DELETE /scraps/{scrapId}로 요청한다", async () => {
    api.onDelete("/scraps/7").reply(200, { data: null });
    const { result } = await renderHook(() => useDeleteScrap(), { wrapper });

    await act(() => result.current.mutateAsync(7));

    expect(api.history.delete[0]!.url).toBe("/scraps/7");
  });

  it("성공하면 scrap 쿼리를 stale로 표시하되 즉시 다시 조회하지 않는다", async () => {
    const queryFn = await observe(["scrap", "getLibrary"]);
    api.onDelete("/scraps/7").reply(200, { data: null });
    const { result } = await renderHook(() => useDeleteScrap(), { wrapper });

    await act(() => result.current.mutateAsync(7));

    expect(
      queryClient.getQueryState(["scrap", "getLibrary"])?.isInvalidated,
    ).toBe(true);
    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it("성공해도 scrap과 무관한 쿼리는 무효화하지 않는다", async () => {
    queryClient.setQueryData(["smalltalk", "get"], "data");
    api.onDelete("/scraps/7").reply(200, { data: null });
    const { result } = await renderHook(() => useDeleteScrap(), { wrapper });

    await act(() => result.current.mutateAsync(7));

    expect(queryClient.getQueryState(["smalltalk", "get"])?.isInvalidated).toBe(
      false,
    );
  });

  it("404 응답이면 ApiError로 실패하고 scrap 쿼리는 무효화되지 않는다", async () => {
    queryClient.setQueryData(["scrap", "getLibrary"], "data");
    api
      .onDelete("/scraps/7")
      .reply(404, { code: "NOT_FOUND", message: "없는 스크랩" });
    const { result } = await renderHook(() => useDeleteScrap(), { wrapper });

    await act(() => result.current.mutateAsync(7).catch(() => undefined));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(result.current.error).toMatchObject({
      status: 404,
      code: "NOT_FOUND",
    });
    expect(
      queryClient.getQueryState(["scrap", "getLibrary"])?.isInvalidated,
    ).toBe(false);
  });
});
