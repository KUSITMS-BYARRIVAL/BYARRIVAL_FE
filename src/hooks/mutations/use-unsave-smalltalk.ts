import { useMutation, useQueryClient } from "@tanstack/react-query";

import { scrapService } from "@/apis/scrap-service";

export function useUnsaveSmalltalk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scrapService.unsaveSmalltalk,
    // 보관함 · 마이홈 목록과, 다시 들어올 때 보일 스몰토크의 scrapped 값을 맞춘다
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["scrap"] }),
        queryClient.invalidateQueries({ queryKey: ["smalltalk"] }),
      ]),
  });
}
