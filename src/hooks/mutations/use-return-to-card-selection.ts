import { useMutation, useQueryClient } from "@tanstack/react-query";

import { rideService } from "@/apis/ride-service";
import type { TodayRoute } from "@/types/ride/ride.types";

export function useReturnToCardSelection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rideService.returnToCardSelection,
    // 응답이 CREATED로 돌아간 노선이라 바로 넣는다 — 돌아간 카드 선택 화면이 곧바로 담기 · 빼기를 할 수 있다
    onSuccess: (route) => {
      queryClient.setQueryData<TodayRoute>(["ride", "getToday"], {
        state: route.status,
        route,
      });
      return queryClient.invalidateQueries({ queryKey: ["ride", "getHome"] });
    },
  });
}
