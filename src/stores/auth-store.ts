import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

import { queryClient } from "@/lib/query-client";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

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
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
    ]);
    set({ accessToken, refreshToken });
  },
  // 이전 사용자 데이터가 남지 않게 캐시까지 비운다
  clearSession: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
    set({ accessToken: null, refreshToken: null });
    queryClient.clear();
  },
}));
