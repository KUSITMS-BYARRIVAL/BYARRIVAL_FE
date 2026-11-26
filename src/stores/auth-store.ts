import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

import { posthog } from "@/lib/analytics";
import { queryClient } from "@/lib/query-client";
import { useOnboardingStore } from "@/stores/onboarding-store";

// 두 토큰을 한 항목에 묶어 저장 — 따로 저장하다 하나만 실패해 짝이 어긋나는 일을 막는다
const TOKENS_KEY = "tokens";
// 앱을 다시 켤 때 네트워크 없이 온보딩 / 홈 중 어디로 보낼지 정하려고 함께 저장한다
const ONBOARDED_KEY = "onboarded";
const TERMS_AGREED_KEY = "termsAgreed";

export type Tokens = { accessToken: string; refreshToken: string };

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  /** 온보딩을 마쳤는지. 라우트 가드가 온보딩 / 홈을 고르는 기준 */
  isOnboarded: boolean;
  /** 필수 약관에 동의했는지. 온보딩 전 회원을 약관 / 닉네임 중 어디로 보낼지 정한다 */
  isTermsAgreed: boolean;
  /** 앱 시작 때 저장된 세션을 다 읽었는지. 그전에는 스플래시를 유지한다 */
  isRestored: boolean;
  restoreSession: () => Promise<void>;
  startSession: (session: {
    tokens: Tokens;
    isOnboarded: boolean;
    isTermsAgreed: boolean;
  }) => Promise<void>;
  setTokens: (tokens: Tokens) => Promise<void>;
  setOnboarded: () => Promise<void>;
  setTermsAgreed: () => Promise<void>;
  clearSession: () => Promise<void>;
};

const parseTokens = (raw: string | null): Tokens | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<Tokens>;
    return parsed.accessToken && parsed.refreshToken
      ? { accessToken: parsed.accessToken, refreshToken: parsed.refreshToken }
      : null;
  } catch {
    return null;
  }
};

// 토큰 원본은 SecureStore, 스토어는 요청마다 읽기 위한 메모리 사본 (persist 금지 — security.md)
export const useAuthStore = create<AuthState>()((set, get) => ({
  accessToken: null,
  refreshToken: null,
  isOnboarded: false,
  isTermsAgreed: false,
  isRestored: false,
  restoreSession: async () => {
    try {
      const [rawTokens, onboarded, termsAgreed] = await Promise.all([
        SecureStore.getItemAsync(TOKENS_KEY),
        SecureStore.getItemAsync(ONBOARDED_KEY),
        SecureStore.getItemAsync(TERMS_AGREED_KEY),
      ]);
      // 저장 형식이 깨졌으면 로그인하지 않은 것으로 본다
      const tokens = parseTokens(rawTokens);
      // 약관 화면 전에 로그인한 세션은 값이 없다 — 예전처럼 닉네임으로 보낸다
      if (tokens)
        set({
          ...tokens,
          isOnboarded: onboarded === "true",
          isTermsAgreed: termsAgreed !== "false",
        });
    } finally {
      set({ isRestored: true });
    }
  },
  startSession: async ({ tokens, isOnboarded, isTermsAgreed }) => {
    await Promise.all([
      SecureStore.setItemAsync(ONBOARDED_KEY, String(isOnboarded)),
      SecureStore.setItemAsync(TERMS_AGREED_KEY, String(isTermsAgreed)),
    ]);
    set({ isOnboarded, isTermsAgreed });
    await get().setTokens(tokens);
  },
  setTokens: async ({ accessToken, refreshToken }) => {
    await SecureStore.setItemAsync(
      TOKENS_KEY,
      JSON.stringify({ accessToken, refreshToken }),
    );
    set({ accessToken, refreshToken });
  },
  setOnboarded: async () => {
    await SecureStore.setItemAsync(ONBOARDED_KEY, "true");
    set({ isOnboarded: true });
  },
  setTermsAgreed: async () => {
    await SecureStore.setItemAsync(TERMS_AGREED_KEY, "true");
    set({ isTermsAgreed: true });
  },
  // 이전 사용자 데이터가 남지 않게 캐시와 온보딩 초안까지 비운다
  // 저장소 삭제가 실패해도 앱 안의 세션은 반드시 비운다 (실패는 호출한 쪽에 그대로 알린다)
  clearSession: async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKENS_KEY),
        SecureStore.deleteItemAsync(ONBOARDED_KEY),
        SecureStore.deleteItemAsync(TERMS_AGREED_KEY),
      ]);
    } finally {
      set({
        accessToken: null,
        refreshToken: null,
        isOnboarded: false,
        isTermsAgreed: false,
      });
      queryClient.clear();
      useOnboardingStore.getState().reset();
      // 같은 기기에서 다음에 로그인한 사람의 이벤트가 이전 사용자에게 묶이지 않게 한다
      posthog.reset();
    }
  },
}));
