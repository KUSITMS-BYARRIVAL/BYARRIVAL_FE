import { useMutation, useQueryClient } from "@tanstack/react-query";

import { scrapService } from "@/apis/scrap-service";

export function useSaveArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scrapService.saveArticle,
    // 보관함 · 마이홈 목록과, 정거장 기사의 scrapped 값을 맞춘다
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["scrap"] }),
        queryClient.invalidateQueries({ queryKey: ["ride", "getStop"] }),
      ]),
  });
}
