import { useMutation, useQueryClient } from "@tanstack/react-query";

import { quizService } from "@/apis/quiz-service";

export function useAnswerQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: quizService.answer,
    // 다시 들어오면 이어 풀 위치 · 결과가 바뀌므로 퀴즈 조회를 모두 새로 받게 한다
    // 다시 받기를 기다리지 않는다 — 채점 결과는 이미 왔으니 바로 보여준다
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["quiz"] });
    },
  });
}
