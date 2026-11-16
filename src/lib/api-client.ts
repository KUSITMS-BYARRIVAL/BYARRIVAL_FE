import axios, { isAxiosError, type InternalAxiosRequestConfig } from "axios";

import { type Tokens, useAuthStore } from "@/stores/auth-store";
import { type ApiResponse, toApiError } from "@/types/api";

// .env에는 호스트만 두고 Swagger 경로의 공통 접두사는 여기서 붙인다
const API_BASE_URL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1`;
const TIMEOUT_MS = 10000;

export const baseApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

baseApi.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// 동시에 여러 요청이 401이어도 재발급은 1번만 하도록 진행 중인 요청을 공유한다
let reissuePromise: Promise<void> | null = null;

async function reissueTokens(refreshToken: string) {
  try {
    // baseApi를 쓰면 재발급 401이 다시 인터셉터로 들어와 무한 반복된다
    const res = await axios.post<ApiResponse<Tokens>>(
      `${API_BASE_URL}/auth/reissue`,
      { refreshToken },
      { timeout: TIMEOUT_MS },
    );
    await useAuthStore.getState().setTokens(res.data.data);
  } catch (error) {
    await useAuthStore.getState().clearSession();
    throw error;
  }
}

type RetryableConfig = InternalAxiosRequestConfig & { isRetried?: boolean };

baseApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config: RetryableConfig | undefined = isAxiosError(error)
      ? error.config
      : undefined;
    const { refreshToken } = useAuthStore.getState();
    const canReissue =
      error?.response?.status === 401 &&
      config &&
      !config.isRetried &&
      refreshToken;
    if (!canReissue) return Promise.reject(toApiError(error));

    config.isRetried = true;
    reissuePromise ??= reissueTokens(refreshToken).finally(() => {
      reissuePromise = null;
    });
    try {
      await reissuePromise;
    } catch {
      return Promise.reject(toApiError(error));
    }
    // 요청 인터셉터가 새 accessToken을 다시 붙인다
    return baseApi(config);
  },
);
