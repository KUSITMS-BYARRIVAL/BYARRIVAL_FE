import { baseApi } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { Home, PopularChip, TodayRoute } from "@/types/ride/ride.types";

export const rideService = {
  getToday: async () => {
    const res = await baseApi.get<ApiResponse<TodayRoute>>("/routes/today");
    return res.data.data;
  },
  getHome: async () => {
    const res = await baseApi.get<ApiResponse<Home>>("/home");
    return res.data.data;
  },
  /** jobGroup을 빼면 전체 칩 */
  getPopular: async (jobGroup?: string) => {
    const res = await baseApi.get<ApiResponse<PopularChip>>("/home/popular", {
      params: { jobGroup },
    });
    return res.data.data;
  },
};
