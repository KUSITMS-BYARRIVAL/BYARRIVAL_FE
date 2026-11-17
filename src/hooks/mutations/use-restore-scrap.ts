import { useMutation, useQueryClient } from "@tanstack/react-query";

import { scrapService } from "@/apis/scrap-service";

export function useRestoreScrap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scrapService.restore,
    // 실패해도 서버 상태(삭제됨)로 맞춘다
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["scrap"] }),
  });
}
