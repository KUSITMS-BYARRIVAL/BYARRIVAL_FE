import { baseApi } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type {
  QuizAnswer,
  QuizProgress,
  QuizSet,
} from "@/types/quiz/quiz.types";

export const quizService = {
  getQuizzes: async (routeId: number) => {
    const res = await baseApi.get<ApiResponse<QuizSet>>(
      `/routes/${routeId}/quizzes`,
    );
    return res.data.data;
  },
  answer: async ({
    routeId,
    quizId,
    choiceSeq,
  }: {
    routeId: number;
    quizId: number;
    choiceSeq: number;
  }) => {
    const res = await baseApi.post<ApiResponse<QuizAnswer>>(
      `/routes/${routeId}/quizzes/${quizId}/answers`,
      { choiceSeq },
    );
    return res.data.data;
  },
  getResult: async (routeId: number) => {
    const res = await baseApi.get<ApiResponse<QuizProgress>>(
      `/routes/${routeId}/quizzes/result`,
    );
    return res.data.data;
  },
};
