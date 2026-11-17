import { useQuery } from "@tanstack/react-query";

import { statsService } from "@/apis/stats-service";
import type { UsageGraph } from "@/types/stats/stats.types";

export function useGetStatsWeekly() {
  return useQuery<UsageGraph>({
    queryKey: ["stats", "getWeeklyGraph"],
    queryFn: statsService.getWeeklyGraph,
  });
}
