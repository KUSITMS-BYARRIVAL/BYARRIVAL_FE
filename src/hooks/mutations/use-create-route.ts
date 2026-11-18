import { useMutation, useQueryClient } from "@tanstack/react-query";

import { rideService } from "@/apis/ride-service";

export function useCreateRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rideService.create,
    // 응답이 곧 오늘 노선이라 다시 받지 않고 넣는다. 홈 탑승 버튼도 상태가 바뀐다
    onSuccess: (todayRoute) => {
      queryClient.setQueryData(["ride", "getToday"], todayRoute);
      return queryClient.invalidateQueries({ queryKey: ["ride", "getHome"] });
    },
  });
}
