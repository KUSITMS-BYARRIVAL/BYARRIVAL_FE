import { useQuery } from "@tanstack/react-query";

import { rideService } from "@/apis/ride-service";
import type { Home } from "@/types/ride/ride.types";

export function useGetHome() {
  return useQuery<Home>({
    queryKey: ["ride", "getHome"],
    queryFn: rideService.getHome,
  });
}
