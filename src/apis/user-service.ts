import { baseApi } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { Me } from "@/types/user/user.types";

export const userService = {
  getMe: async () => {
    const res = await baseApi.get<ApiResponse<Me>>("/users/me");
    return res.data.data;
  },
};
