import { useMutation, useQueryClient } from "@tanstack/react-query";

import { rideService } from "@/apis/ride-service";

export function useDepart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rideService.depart,
    // 노선이 IN_PROGRESS로 바뀌고 진행 정보(ride)가 생긴다 (오늘 노선 · 홈 탑승 버튼)
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ride"] }),
  });
}
