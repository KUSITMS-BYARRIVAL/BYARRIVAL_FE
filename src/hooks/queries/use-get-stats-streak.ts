import { useQuery } from "@tanstack/react-query";

import { statsService } from "@/apis/stats-service";
import type { Streak } from "@/types/stats/stats.types";

export function useGetStatsStreak() {
  return useQuery<Streak>({
    queryKey: ["stats", "getStreak"],
    queryFn: statsService.getStreak,
  });
}
