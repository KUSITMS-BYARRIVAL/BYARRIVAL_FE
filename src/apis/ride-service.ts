import { baseApi } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type {
  Condition,
  Home,
  PopularChip,
  TodayRoute,
} from "@/types/ride/ride.types";

export const rideService = {
  getToday: async () => {
    const res = await baseApi.get<ApiResponse<TodayRoute>>("/routes/today");
    return res.data.data;
  },
  /** 오늘 노선이 이미 있으면 그 노선을, 추천 기사가 0건이면 EMPTY를 돌려준다 */
  create: async (condition: Condition) => {
    const res = await baseApi.post<ApiResponse<TodayRoute>>("/routes", {
      condition,
    });
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
