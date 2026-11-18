import { useMutation, useQueryClient } from "@tanstack/react-query";

import { rideService } from "@/apis/ride-service";

export function useArrive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rideService.arrive,
    // 완주로 노선 상태(홈 탑승 버튼) · 연속 이용 일수 · 마이홈 통계가 바뀐다
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["ride"] }),
        queryClient.invalidateQueries({ queryKey: ["stats"] }),
      ]),
  });
}
