import { useQuery } from "@tanstack/react-query";

import { statsService } from "@/apis/stats-service";
import type { StatSummary, StatsPeriod } from "@/types/stats/stats.types";

export function useGetStatsSummary(period: StatsPeriod) {
  return useQuery<StatSummary>({
    queryKey: ["stats", "getSummary", period],
    queryFn: () => statsService.getSummary(period),
  });
}
