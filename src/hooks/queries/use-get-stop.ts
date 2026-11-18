import { useQuery } from "@tanstack/react-query";

import { rideService } from "@/apis/ride-service";
import type { RouteStop } from "@/types/ride/ride.types";

// 다음 정거장을 미리 받아 볼 수 있는지 확인할 때(queryClient.fetchQuery)도 같은 키를 쓰도록 내보낸다
export const getStopQuery = (routeId: number, stopNumber: number) => ({
  queryKey: ["ride", "getStop", routeId, stopNumber],
  queryFn: () => rideService.getStop({ routeId, stopNumber }),
});

export function useGetStop(routeId: number, stopNumber: number) {
  return useQuery<RouteStop>(getStopQuery(routeId, stopNumber));
}
