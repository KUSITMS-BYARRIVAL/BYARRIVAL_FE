import { baseApi } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type {
  SocialLoginRequest,
  SocialLoginResponse,
} from "@/types/auth/auth.types";

export const authService = {
  socialLogin: async (body: SocialLoginRequest) => {
    const res = await baseApi.post<ApiResponse<SocialLoginResponse>>(
      "/auth/login",
      body,
    );
    return res.data.data;
  },
  logout: async (refreshToken: string) => {
    await baseApi.post<ApiResponse<null>>("/auth/logout", { refreshToken });
  },
};
