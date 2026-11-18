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
  /** fcmToken을 함께 보내면 서버가 이 기기의 푸시 토큰도 지운다 */
  logout: async (refreshToken: string, fcmToken?: string) => {
    await baseApi.post<ApiResponse<null>>("/auth/logout", {
      refreshToken,
      fcmToken,
    });
  },
};
