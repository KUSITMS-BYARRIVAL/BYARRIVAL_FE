import { baseApi } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type {
  DeviceRegisterRequest,
  NotificationPage,
  NotificationPageParams,
  NotificationSettings,
  NotificationSettingUpdateRequest,
  UnreadCount,
} from "@/types/notification/notification.types";

export const notificationService = {
  getSettings: async () => {
    const res = await baseApi.get<ApiResponse<NotificationSettings>>(
      "/notification-settings",
    );
    return res.data.data;
  },
  updateSettings: async (body: NotificationSettingUpdateRequest) => {
    const res = await baseApi.patch<ApiResponse<NotificationSettings>>(
      "/notification-settings",
      body,
    );
    return res.data.data;
  },
  register: async (body: DeviceRegisterRequest) => {
    const res = await baseApi.put<ApiResponse<null>>("/devices", body);
    return res.data.data;
  },
  getNotifications: async (params: NotificationPageParams) => {
    const res = await baseApi.get<ApiResponse<NotificationPage>>(
      "/notifications",
      { params },
    );
    return res.data.data;
  },
  getUnreadCount: async () => {
    const res = await baseApi.get<ApiResponse<UnreadCount>>(
      "/notifications/unread-count",
    );
    return res.data.data;
  },
  markRead: async (notificationId: number) => {
    const res = await baseApi.patch<ApiResponse<null>>(
      `/notifications/${notificationId}/read`,
    );
    return res.data.data;
  },
  markAllRead: async () => {
    const res = await baseApi.patch<ApiResponse<null>>(
      "/notifications/read-all",
    );
    return res.data.data;
  },
};
