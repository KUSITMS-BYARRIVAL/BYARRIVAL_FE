import { baseApi } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type {
  CategoryResponse,
  DailyCommute,
  NotificationPermission,
  OnboardingResponse,
  OnboardingUpdateRequest,
  RegionSidoResponse,
  UserMeResponse,
  UserUpdateRequest,
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
  getMe: async () => {
    const res = await baseApi.get<ApiResponse<UserMeResponse>>("/users/me");
    return res.data.data;
  },
  updateMe: async (body: UserUpdateRequest) => {
    const res = await baseApi.patch<ApiResponse<UserMeResponse>>(
      "/users/me",
      body,
    );
    return res.data.data;
  },
  replaceWeeklyCommute: async (days: DailyCommute[]) => {
    const res = await baseApi.put<ApiResponse<UserMeResponse>>(
      "/users/me/weekly-commute",
      { days },
    );
    return res.data.data;
  },
  changeRegion: async (sigunguId: number) => {
    const res = await baseApi.put<ApiResponse<UserMeResponse>>(
      "/users/me/region",
      { sigunguId },
    );
    return res.data.data;
  },
  replaceJobGroups: async (jobGroups: string[]) => {
    const res = await baseApi.put<ApiResponse<UserMeResponse>>(
      "/users/me/job-groups",
      { jobGroups },
    );
    return res.data.data;
  },
  replaceInterestCategories: async (categoryIds: number[]) => {
    const res = await baseApi.put<ApiResponse<UserMeResponse>>(
      "/users/me/interest-categories",
      { categoryIds },
    );
    return res.data.data;
  },
  changeProfileImage: async (image: { uri: string; mimeType: string }) => {
    const form = new FormData();
    // RN의 FormData는 파일을 { uri, name, type } 객체로 받는다
    form.append("image", {
      uri: image.uri,
      name: image.mimeType === "image/png" ? "profile.png" : "profile.jpg",
      type: image.mimeType,
    } as unknown as Blob);
    const res = await baseApi.put<ApiResponse<UserMeResponse>>(
      "/users/me/profile-image",
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data.data;
  },
  deleteProfileImage: async () => {
    const res = await baseApi.delete<ApiResponse<UserMeResponse>>(
      "/users/me/profile-image",
    );
    return res.data.data;
  },
  updateNotificationPermission: async (permission: NotificationPermission) => {
    await baseApi.put<ApiResponse<{ permission: NotificationPermission }>>(
      "/users/me/notification-permission",
      { permission },
    );
  },
  withdraw: async () => {
    await baseApi.delete<ApiResponse<null>>("/users/me");
  },
};
