import { useMutation } from "@tanstack/react-query";

import { authService } from "@/apis/auth-service";
import { posthog, track } from "@/lib/analytics";
import { useAuthStore } from "@/stores/auth-store";

export function useSocialLogin() {
  const startSession = useAuthStore((state) => state.startSession);
  return useMutation({
    mutationFn: authService.socialLogin,
    // 세션을 저장하면 루트 가드가 약관 / 온보딩 / 홈으로 보낸다
    // 그러면 로그인 화면이 닫혀 화면 쪽 mutate 콜백은 불리지 않을 수 있어, 분석 이벤트도 여기서 보낸다
    onSuccess: (
      {
        userId,
        isNewUser,
        accessToken,
        refreshToken,
        onboardingCompleted,
        termsAgreed,
      },
      { provider },
    ) => {
      posthog.identify(String(userId));
      track("login_complete", { method: provider, is_new_user: isNewUser });
      return startSession({
        tokens: { accessToken, refreshToken },
        isOnboarded: onboardingCompleted,
        isTermsAgreed: termsAgreed,
      });
    },
  });
}
