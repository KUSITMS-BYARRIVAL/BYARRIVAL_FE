import { baseApi } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type {
  BoardingPass,
  Condition,
  Home,
  PopularChip,
  Route,
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
  /** 담은 순서가 운행 순서. T×120%를 넘으면 ROUTE_CART_OVER_LIMIT */
  addCard: async ({
    routeId,
    articleId,
  }: {
    routeId: number;
    articleId: number;
  }) => {
    const res = await baseApi.put<ApiResponse<Route>>(
      `/routes/${routeId}/cart/${articleId}`,
    );
    return res.data.data;
  },
  removeCard: async ({
    routeId,
    articleId,
  }: {
    routeId: number;
    articleId: number;
  }) => {
    const res = await baseApi.delete<ApiResponse<Route>>(
      `/routes/${routeId}/cart/${articleId}`,
    );
    return res.data.data;
  },
  /** cardOrder는 1부터 */
  saveCursor: async ({
    routeId,
    cardOrder,
  }: {
    routeId: number;
    cardOrder: number;
  }) => {
    const res = await baseApi.put<ApiResponse<null>>(
      `/routes/${routeId}/cursor`,
      { cardOrder },
    );
    return res.data.data;
  },
  /** 조건(T×70~120% 또는 더 담을 카드 없음)을 못 채우면 ROUTE_NOT_STARTABLE */
  board: async (routeId: number) => {
    const res = await baseApi.post<ApiResponse<BoardingPass>>(
      `/routes/${routeId}/boarding`,
    );
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
