import { baseApi } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type {
  CategoryResponse,
  OnboardingResponse,
  OnboardingUpdateRequest,
  RegionSidoResponse,
} from "@/types/user/user.types";

export const userService = {
  getOnboarding: async () => {
    const res = await baseApi.get<ApiResponse<OnboardingResponse>>(
      "/users/me/onboarding",
    );
    return res.data.data;
  },
  updateOnboarding: async (body: OnboardingUpdateRequest) => {
    const res = await baseApi.patch<ApiResponse<OnboardingResponse>>(
      "/users/me/onboarding",
      body,
    );
    return res.data.data;
  },
  completeOnboarding: async () => {
    const res = await baseApi.post<ApiResponse<OnboardingResponse>>(
      "/users/me/onboarding/complete",
    );
    return res.data.data;
  },
  getCategories: async () => {
    const res =
      await baseApi.get<ApiResponse<CategoryResponse[]>>("/categories");
    return res.data.data;
  },
  getRegions: async () => {
    const res =
      await baseApi.get<ApiResponse<RegionSidoResponse[]>>("/regions");
    return res.data.data;
  },
};
