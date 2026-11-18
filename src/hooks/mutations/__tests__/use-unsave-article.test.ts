import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { act, createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";
import { ApiError } from "@/types/api";

import { useUnsaveArticle } from "../use-unsave-article";

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

const status = { targetId: 3, scrapped: false };

describe("useUnsaveArticle", () => {
  it("DELETE /scraps/articles/{articleId}로 요청한다", async () => {
    api.onDelete("/scraps/articles/3").reply(200, { data: status });
    const { result } = await renderHook(() => useUnsaveArticle(), {
      wrapper,
    });

    await act(() => result.current.mutateAsync(3));

    expect(api.history.delete[0]!.url).toBe("/scraps/articles/3");
  });

  it("성공하면 응답 data(ScrapStatus)를 반환한다", async () => {
    api.onDelete("/scraps/articles/3").reply(200, { data: status });
    const { result } = await renderHook(() => useUnsaveArticle(), {
      wrapper,
    });

    let data: unknown;
    await act(async () => {
      data = await result.current.mutateAsync(3);
    });

    expect(data).toEqual(status);
  });

  it("성공하면 scrap · 정거장 쿼리를 모두 무효화한다", async () => {
    queryClient.setQueryData(["scrap", "getLibrary"], "data");
    queryClient.setQueryData(["ride", "getStop", 7, 1], "data");
    api.onDelete("/scraps/articles/3").reply(200, { data: status });
    const { result } = await renderHook(() => useUnsaveArticle(), {
      wrapper,
    });

    await act(() => result.current.mutateAsync(3));

    expect(
      queryClient.getQueryState(["scrap", "getLibrary"])?.isInvalidated,
    ).toBe(true);
    expect(
      queryClient.getQueryState(["ride", "getStop", 7, 1])?.isInvalidated,
    ).toBe(true);
  });

  it("실패하면 ApiError로 reject되고 캐시는 무효화되지 않는다", async () => {
    queryClient.setQueryData(["scrap", "getLibrary"], "data");
    queryClient.setQueryData(["ride", "getStop", 7, 1], "data");
    api
      .onDelete("/scraps/articles/3")
      .reply(404, { code: "NOT_FOUND", message: "없는 기사" });
    const { result } = await renderHook(() => useUnsaveArticle(), {
      wrapper,
    });

    await act(() => result.current.mutateAsync(3).catch(() => undefined));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(result.current.error).toMatchObject({
      status: 404,
      code: "NOT_FOUND",
    });
    expect(
      queryClient.getQueryState(["scrap", "getLibrary"])?.isInvalidated,
    ).toBe(false);
    expect(
      queryClient.getQueryState(["ride", "getStop", 7, 1])?.isInvalidated,
    ).toBe(false);
  });
});
