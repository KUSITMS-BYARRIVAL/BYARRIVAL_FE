import { useQuery } from "@tanstack/react-query";

import { rideService } from "@/apis/ride-service";
import type { TodayRoute } from "@/types/ride/ride.types";

export function useGetTodayRoute() {
  return useQuery<TodayRoute>({
    queryKey: ["ride", "getToday"],
    queryFn: rideService.getToday,
  });
}
