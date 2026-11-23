import { useQuery } from "@tanstack/react-query";

import { rideService } from "@/apis/ride-service";
import type { TodayRoute } from "@/types/ride/ride.types";

// 알림을 눌렀을 때(queryClient.fetchQuery)도 같은 키를 쓰도록 내보낸다
export const getTodayRouteQuery = () => ({
  queryKey: ["ride", "getToday"],
  queryFn: rideService.getToday,
});

export function useGetTodayRoute() {
  return useQuery<TodayRoute>(getTodayRouteQuery());
}
