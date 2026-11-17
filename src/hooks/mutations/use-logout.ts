import { useMutation } from "@tanstack/react-query";

import { authService } from "@/apis/auth-service";
import { useAuthStore } from "@/stores/auth-store";

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const { refreshToken, clearSession } = useAuthStore.getState();
      try {
        if (refreshToken) await authService.logout(refreshToken);
      } catch {
        // 서버 폐기에 실패해도 기기에서는 로그아웃한다 (남은 토큰은 서버에서 만료된다)
      } finally {
        await clearSession();
      }
    },
  });
}
