import { useMutation, useQueryClient } from "@tanstack/react-query";

import { rideService } from "@/apis/ride-service";

export function useDepart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rideService.depart,
    // 노선이 IN_PROGRESS로 바뀌고 진행 정보(ride)가 생긴다 (오늘 노선 · 홈 탑승 버튼)
    // 재조회를 기다리지 않는다 — 기다리면 mutate 콜백의 화면 이동이 재조회만큼 늦어진다
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["ride"] });
    },
  });
}
