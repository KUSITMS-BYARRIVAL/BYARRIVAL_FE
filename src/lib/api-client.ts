import axios, { isAxiosError, type InternalAxiosRequestConfig } from "axios";

import { type Tokens, useAuthStore } from "@/stores/auth-store";
import { type ApiResponse, toApiError } from "@/types/api";

// 값이 없으면 "undefined/api/v1"로 요청이 나가 원인을 찾기 어려우므로 시작 시점에 바로 알린다
if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
  throw new Error("EXPO_PUBLIC_API_BASE_URL이 .env에 없습니다.");
}
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
    // 이동 중 네트워크 끊김 · 5xx로는 세션을 잃지 않게 거절(4xx)일 때만 로그아웃한다
    if (isTokenRejected(error)) await useAuthStore.getState().clearSession();
    throw error;
  }
}

// 서버 에러 계약(거절 코드)이 Swagger에 없어 4xx 전체로 보되, 일시적인 408 · 429는 제외한다
const TRANSIENT_4XX = [408, 429];

function isTokenRejected(error: unknown) {
  const status = isAxiosError(error) ? error.response?.status : undefined;
  return (
    status !== undefined &&
    status >= 400 &&
    status < 500 &&
    !TRANSIENT_4XX.includes(status)
  );
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
    } catch (reissueError) {
      // 토큰 거절이면 원래 401을, 일시적 실패면 재시도 정책이 알 수 있게 그 에러(네트워크 · 5xx)를 넘긴다
      return Promise.reject(
        toApiError(isTokenRejected(reissueError) ? error : reissueError),
      );
    }
    // 요청 인터셉터가 새 accessToken을 다시 붙인다
    return baseApi(config);
  },
);
