import { useQuery } from "@tanstack/react-query";

import { statsService } from "@/apis/stats-service";
import type { Calendar } from "@/types/stats/stats.types";

export function useGetStatsCalendar(year: number) {
  return useQuery<Calendar>({
    queryKey: ["stats", "getCalendar", year],
    queryFn: () => statsService.getCalendar(year),
  });
}
