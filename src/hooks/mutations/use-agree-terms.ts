import { useMutation } from "@tanstack/react-query";

import { userService } from "@/apis/user-service";
import { useAuthStore } from "@/stores/auth-store";

export function useAgreeTerms() {
  const setTermsAgreed = useAuthStore((state) => state.setTermsAgreed);
  return useMutation({
    mutationFn: userService.agree,
    // 저장해 두면 앱을 다시 켜도 약관 화면이 아니라 닉네임부터 시작한다
    onSuccess: () => setTermsAgreed(),
  });
}
