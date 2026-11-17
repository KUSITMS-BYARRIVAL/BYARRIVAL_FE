import { useMutation, useQueryClient } from "@tanstack/react-query";

import { scrapService } from "@/apis/scrap-service";

export function useDeleteScrap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scrapService.delete,
    // 보관함은 지운 항목을 캐시에 남겨 숨겨 두었다가 [되돌리기] 때 바로 다시 보여준다 — 그래서 즉시 다시 조회하지 않고 stale 표시만 한다
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["scrap"],
        refetchType: "none",
      }),
  });
}
