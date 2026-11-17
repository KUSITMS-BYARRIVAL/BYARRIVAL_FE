import { baseApi } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type {
  Calendar,
  StatSummary,
  StatsPeriod,
  Streak,
  UsageGraph,
} from "@/types/stats/stats.types";

export const statsService = {
  getSummary: async (period: StatsPeriod) => {
    const res = await baseApi.get<ApiResponse<StatSummary>>("/stats/summary", {
      params: { period },
    });
    return res.data.data;
  },
  getStreak: async () => {
    const res = await baseApi.get<ApiResponse<Streak>>("/stats/streak");
    return res.data.data;
  },
  getCalendar: async (year: number) => {
    const res = await baseApi.get<ApiResponse<Calendar>>("/stats/calendar", {
      params: { year },
    });
    return res.data.data;
  },
  getWeeklyGraph: async () => {
    const res = await baseApi.get<ApiResponse<UsageGraph>>("/stats/weekly");
    return res.data.data;
  },
};
