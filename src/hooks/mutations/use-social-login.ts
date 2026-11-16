import { useMutation } from "@tanstack/react-query";

import { authService } from "@/apis/auth-service";
import { useAuthStore } from "@/stores/auth-store";

export function useSocialLogin() {
  const setTokens = useAuthStore((state) => state.setTokens);
  return useMutation({
    mutationFn: authService.socialLogin,
    // 이후 요청에 토큰이 붙도록 화면 이동 전에 저장을 끝낸다
    onSuccess: ({ accessToken, refreshToken }) =>
      setTokens({ accessToken, refreshToken }),
  });
}
