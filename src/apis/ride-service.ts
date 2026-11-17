import { baseApi } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { TodayRoute } from "@/types/ride/ride.types";

export const rideService = {
  getToday: async () => {
    const res = await baseApi.get<ApiResponse<TodayRoute>>("/routes/today");
    return res.data.data;
  },
};
