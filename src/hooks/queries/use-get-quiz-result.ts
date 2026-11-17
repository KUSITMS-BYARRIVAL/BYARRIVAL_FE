import { useQuery } from "@tanstack/react-query";

import { quizService } from "@/apis/quiz-service";
import type { QuizProgress } from "@/types/quiz/quiz.types";

/** routeId가 없으면(오늘 노선을 받기 전) 요청하지 않는다 */
export function useGetQuizResult(routeId: number | undefined) {
  return useQuery<QuizProgress>({
    queryKey: ["quiz", "getResult", routeId],
    queryFn: () => quizService.getResult(routeId!),
    enabled: routeId !== undefined,
  });
}
