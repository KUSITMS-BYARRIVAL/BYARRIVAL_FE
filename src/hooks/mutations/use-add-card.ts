import { useMutation, useQueryClient } from "@tanstack/react-query";

import { rideService } from "@/apis/ride-service";
import type { TodayRoute } from "@/types/ride/ride.types";

export function useAddCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rideService.addCard,
    // 응답이 바뀐 노선 전체라 다시 받지 않고 넣는다 — 누르자마자 카드 · 시간 · 시작하기가 바뀐다
    onSuccess: (route) =>
      queryClient.setQueryData<TodayRoute>(["ride", "getToday"], {
        state: route.status,
        route,
      }),
  });
}
