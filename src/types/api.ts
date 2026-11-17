import { isAxiosError } from "axios";

export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

const NETWORK_ERROR_MESSAGE = "네트워크 연결을 확인해 주세요.";
const UNKNOWN_ERROR_MESSAGE = "잠시 후 다시 시도해 주세요.";

export class ApiError extends Error {
  // null = 응답 없음 (네트워크 끊김 · 타임아웃)
  status: number | null;
  code: string;

  constructor(status: number | null, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (!isAxiosError<Partial<ApiResponse<unknown>>>(error)) {
    return new ApiError(null, "UNKNOWN", UNKNOWN_ERROR_MESSAGE);
  }
  if (!error.response) {
    return new ApiError(null, "NETWORK_ERROR", NETWORK_ERROR_MESSAGE);
  }
  const { status, data } = error.response;
  return new ApiError(
    status,
    data?.code ?? "UNKNOWN",
    data?.message ?? UNKNOWN_ERROR_MESSAGE,
  );
}

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError;
    queryMeta: { skipToast?: boolean };
    mutationMeta: { skipToast?: boolean };
  }
}
