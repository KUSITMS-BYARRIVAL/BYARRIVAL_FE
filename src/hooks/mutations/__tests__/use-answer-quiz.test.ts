import { act } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { createElement, type ReactNode } from "react";

import { baseApi } from "@/lib/api-client";

import { useAnswerQuiz } from "../use-answer-quiz";

const api = new MockAdapter(baseApi);

let queryClient: QueryClient;
const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: queryClient }, children);

beforeEach(() => {
  api.reset();
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false, gcTime: Infinity },
    },
  });
});

afterEach(() => queryClient.clear());

describe("useAnswerQuiz", () => {
  it("고른 선택지를 보내고, 성공하면 퀴즈 조회를 새로 받게 표시한다", async () => {
    api.onPost("/routes/7/quizzes/10/answers").reply(200, { data: {} });
    queryClient.setQueryData(["quiz", "getQuizzes", 7], {});
    queryClient.setQueryData(["quiz", "getResult", 7], {});
    const { result } = await renderHook(() => useAnswerQuiz(), { wrapper });

    await act(() =>
      result.current.mutateAsync({ routeId: 7, quizId: 10, choiceSeq: 2 }),
    );

    expect(JSON.parse(api.history.post[0]!.data)).toEqual({ choiceSeq: 2 });
    expect(
      queryClient.getQueryState(["quiz", "getQuizzes", 7])?.isInvalidated,
    ).toBe(true);
    expect(
      queryClient.getQueryState(["quiz", "getResult", 7])?.isInvalidated,
    ).toBe(true);
  });
});
