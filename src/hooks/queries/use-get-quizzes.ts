import { useQuery } from "@tanstack/react-query";

import { quizService } from "@/apis/quiz-service";
import type { QuizSet } from "@/types/quiz/quiz.types";

/** routeId가 없으면(오늘 노선을 받기 전) 요청하지 않는다 */
export function useGetQuizzes(routeId: number | undefined) {
  return useQuery<QuizSet>({
    queryKey: ["quiz", "getQuizzes", routeId],
    queryFn: () => quizService.getQuizzes(routeId!),
    enabled: routeId !== undefined,
  });
}
