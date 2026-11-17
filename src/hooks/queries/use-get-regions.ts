import { useQuery } from "@tanstack/react-query";

import { userService } from "@/apis/user-service";
import type { RegionSidoResponse } from "@/types/user/user.types";

export function useGetRegions() {
  return useQuery<RegionSidoResponse[]>({
    queryKey: ["user", "getRegions"],
    queryFn: userService.getRegions,
    // 행정구역 목록은 앱을 쓰는 동안 바뀌지 않는다
    staleTime: Infinity,
  });
}
