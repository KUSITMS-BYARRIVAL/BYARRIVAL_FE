import { useMutation } from "@tanstack/react-query";

import { authService } from "@/apis/auth-service";
import { useAuthStore } from "@/stores/auth-store";

export function useSocialLogin() {
  const startSession = useAuthStore((state) => state.startSession);
  return useMutation({
    mutationFn: authService.socialLogin,
    // 세션을 저장하면 루트 가드가 약관 / 온보딩 / 홈으로 보낸다
    onSuccess: ({
      accessToken,
      refreshToken,
      onboardingCompleted,
      termsAgreed,
    }) =>
      startSession({
        tokens: { accessToken, refreshToken },
        isOnboarded: onboardingCompleted,
        isTermsAgreed: termsAgreed,
      }),
  });
}
