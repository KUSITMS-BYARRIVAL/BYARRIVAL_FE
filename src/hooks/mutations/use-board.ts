import { useMutation, useQueryClient } from "@tanstack/react-query";

import { rideService } from "@/apis/ride-service";

export function useBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rideService.board,
    // 노선 상태가 BOARDING으로 바뀐다 (오늘 노선 · 홈 탑승 버튼)
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ride"] }),
  });
}
