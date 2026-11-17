import { act } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";

import { useAgreeTerms } from "../use-agree-terms";

jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

const api = new MockAdapter(baseApi);

let queryClient: QueryClient;
const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: queryClient }, children);

const body = {
  agreements: [
    { termsId: 1, agreed: true },
    { termsId: 2, agreed: true },
  ],
};

beforeEach(() => {
  api.reset();
  useAuthStore.setState({ isTermsAgreed: false });
  queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false, gcTime: Infinity } },
  });
});

afterEach(() => queryClient.clear());

describe("useAgreeTerms", () => {
  it("동의 결과를 보내고, 성공하면 약관 동의로 세션을 바꾼다", async () => {
    api.onPost("/terms/agreements").reply(200, { data: [] });
    const { result } = await renderHook(() => useAgreeTerms(), { wrapper });

    await act(() => result.current.mutateAsync(body));

    expect(JSON.parse(api.history.post[0]!.data)).toEqual(body);
    expect(useAuthStore.getState().isTermsAgreed).toBe(true);
  });

  it("실패하면 약관 미동의로 남는다", async () => {
    api.onPost("/terms/agreements").reply(400, { code: "TERMS_REQUIRED" });
    const { result } = await renderHook(() => useAgreeTerms(), { wrapper });

    await act(() => result.current.mutateAsync(body).catch(() => undefined));

    expect(useAuthStore.getState().isTermsAgreed).toBe(false);
  });
});
