import { useMutation, useQueryClient } from "@tanstack/react-query";

import { rideService } from "@/apis/ride-service";
import type { RouteStop } from "@/types/ride/ride.types";

export function useReadStop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rideService.read,
    // 다시 받기를 기다리지 않고 바로 완독으로 바꿔 다음 버튼을 연다. 진행 정보(오늘 노선 · 홈)는 새로 받는다
    onSuccess: ({ progress }, { routeId, stopNumber }) => {
      queryClient.setQueryData<RouteStop>(
        ["ride", "getStop", routeId, stopNumber],
        (stop) => stop && { ...stop, read: true, progress },
      );
      return queryClient.invalidateQueries({ queryKey: ["ride"] });
    },
  });
}
