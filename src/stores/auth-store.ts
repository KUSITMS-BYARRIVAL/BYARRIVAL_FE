import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

import { queryClient } from "@/lib/query-client";
import { useOnboardingStore } from "@/stores/onboarding-store";

// 두 토큰을 한 항목에 묶어 저장 — 따로 저장하다 하나만 실패해 짝이 어긋나는 일을 막는다
const TOKENS_KEY = "tokens";
// 앱을 다시 켤 때 네트워크 없이 온보딩 / 홈 중 어디로 보낼지 정하려고 함께 저장한다
const ONBOARDED_KEY = "onboarded";

export type Tokens = { accessToken: string; refreshToken: string };

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  /** 온보딩을 마쳤는지. 라우트 가드가 온보딩 / 홈을 고르는 기준 */
  isOnboarded: boolean;
  /** 앱 시작 때 저장된 세션을 다 읽었는지. 그전에는 스플래시를 유지한다 */
  isRestored: boolean;
  restoreSession: () => Promise<void>;
  startSession: (session: {
    tokens: Tokens;
    isOnboarded: boolean;
  }) => Promise<void>;
  setTokens: (tokens: Tokens) => Promise<void>;
  setOnboarded: () => Promise<void>;
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
  isRestored: false,
  restoreSession: async () => {
    try {
      const [rawTokens, onboarded] = await Promise.all([
        SecureStore.getItemAsync(TOKENS_KEY),
        SecureStore.getItemAsync(ONBOARDED_KEY),
      ]);
      // 저장 형식이 깨졌으면 로그인하지 않은 것으로 본다
      const tokens = parseTokens(rawTokens);
      if (tokens) set({ ...tokens, isOnboarded: onboarded === "true" });
    } finally {
      set({ isRestored: true });
    }
  },
  startSession: async ({ tokens, isOnboarded }) => {
    await SecureStore.setItemAsync(ONBOARDED_KEY, String(isOnboarded));
    set({ isOnboarded });
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
  // 이전 사용자 데이터가 남지 않게 캐시와 온보딩 초안까지 비운다
  // 저장소 삭제가 실패해도 앱 안의 세션은 반드시 비운다 (실패는 호출한 쪽에 그대로 알린다)
  clearSession: async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKENS_KEY),
        SecureStore.deleteItemAsync(ONBOARDED_KEY),
      ]);
    } finally {
      set({ accessToken: null, refreshToken: null, isOnboarded: false });
      queryClient.clear();
      useOnboardingStore.getState().reset();
    }
  },
}));
