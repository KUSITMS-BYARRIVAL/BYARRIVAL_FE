import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

import { queryClient } from "@/lib/query-client";
import { useOnboardingStore } from "@/stores/onboarding-store";

// 두 토큰을 한 항목에 묶어 저장 — 따로 저장하다 하나만 실패해 짝이 어긋나는 일을 막는다
const TOKENS_KEY = "tokens";

export type Tokens = { accessToken: string; refreshToken: string };

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (tokens: Tokens) => Promise<void>;
  clearSession: () => Promise<void>;
};

// 토큰 원본은 SecureStore, 스토어는 요청마다 읽기 위한 메모리 사본 (persist 금지 — security.md)
export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  refreshToken: null,
  setTokens: async ({ accessToken, refreshToken }) => {
    await SecureStore.setItemAsync(
      TOKENS_KEY,
      JSON.stringify({ accessToken, refreshToken }),
    );
    set({ accessToken, refreshToken });
  },
  // 이전 사용자 데이터가 남지 않게 캐시와 온보딩 초안까지 비운다
  clearSession: async () => {
    await SecureStore.deleteItemAsync(TOKENS_KEY);
    set({ accessToken: null, refreshToken: null });
    queryClient.clear();
    useOnboardingStore.getState().reset();
  },
}));
