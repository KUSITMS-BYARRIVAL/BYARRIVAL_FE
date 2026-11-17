import { useMutation } from "@tanstack/react-query";

import { userService } from "@/apis/user-service";
import { useAuthStore } from "@/stores/auth-store";

export function useWithdraw() {
  return useMutation({
    mutationFn: userService.withdraw,
    // 서버가 모든 기기에서 로그아웃시키므로 이 기기의 세션도 비운다
    onSuccess: () => useAuthStore.getState().clearSession(),
  });
}
