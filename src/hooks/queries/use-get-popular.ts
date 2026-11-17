import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { rideService } from "@/apis/ride-service";
import type { PopularChip } from "@/types/ride/ride.types";

// 다른 칩을 미리 받아 둘 때(queryClient.prefetchQuery)도 같은 키를 쓰도록 내보낸다
export const getPopularQuery = (jobGroup?: string) => ({
  queryKey: ["ride", "getPopular", jobGroup],
  queryFn: () => rideService.getPopular(jobGroup),
  // 미리 받아 둔 칩을 바꿀 때 곧바로 다시 받지 않도록 잠깐은 그대로 쓴다
  staleTime: 60_000,
});

/** jobGroup(직군 코드)을 빼면 전체 칩 */
export function useGetPopular(jobGroup?: string) {
  return useQuery<PopularChip>({
    ...getPopularQuery(jobGroup),
    // 칩을 바꿀 때 새 목록이 올 때까지 이전 목록을 둬서 로딩 표시로 깜빡이지 않게 한다
    placeholderData: keepPreviousData,
  });
}
