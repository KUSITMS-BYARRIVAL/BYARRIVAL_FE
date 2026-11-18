import { useMutation, useQueryClient } from "@tanstack/react-query";

import { rideService } from "@/apis/ride-service";

export function useBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rideService.board,
    // 노선 상태가 BOARDING으로 바뀐다 (오늘 노선 · 홈 탑승 버튼)
    // 재조회를 기다리지 않는다 — 기다리면 mutate 콜백의 화면 이동이 재조회만큼 늦어진다
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["ride"] });
    },
  });
}
