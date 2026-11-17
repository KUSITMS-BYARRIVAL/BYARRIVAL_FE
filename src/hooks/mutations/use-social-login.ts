import { useMutation } from "@tanstack/react-query";

import { authService } from "@/apis/auth-service";
import { useAuthStore } from "@/stores/auth-store";

export function useSocialLogin() {
  const startSession = useAuthStore((state) => state.startSession);
  return useMutation({
    mutationFn: authService.socialLogin,
    // 세션을 저장하면 루트 가드가 온보딩 / 홈으로 보낸다
    // TODO: termsAgreed가 false면 약관 화면(ONB-03)으로 — 약관 화면 디자인 전까지는 온보딩으로 보낸다
    onSuccess: ({ accessToken, refreshToken, onboardingCompleted }) =>
      startSession({
        tokens: { accessToken, refreshToken },
        isOnboarded: onboardingCompleted,
      }),
  });
}
