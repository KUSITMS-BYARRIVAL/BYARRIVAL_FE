import { MutationObserver } from "@tanstack/react-query";

import { useToastStore } from "@/stores/toast-store";
import { ApiError } from "@/types/api";

import { queryClient } from "../query-client";

const retry = queryClient.getDefaultOptions().queries?.retry as (
  failureCount: number,
  error: ApiError,
) => boolean;

const failMutation = async (
  error: ApiError,
  meta?: { skipToast?: boolean },
) => {
  const observer = new MutationObserver(queryClient, {
    mutationFn: () => Promise.reject(error),
    meta,
  });
  await observer.mutate().catch(() => undefined);
};

describe("queryClient 쿼리 재시도 정책", () => {
  it("네트워크 에러(status null)는 재시도한다", () => {
    expect(retry(0, new ApiError(null, "NETWORK_ERROR", "x"))).toBe(true);
  });

  it.each([500, 503])("%i 응답은 재시도한다", (status) => {
    expect(retry(0, new ApiError(status, "SERVER", "x"))).toBe(true);
  });

  it.each([400, 401, 404])("%i 응답은 재시도하지 않는다", (status) => {
    expect(retry(0, new ApiError(status, "CLIENT", "x"))).toBe(false);
  });

  it("499는 재시도하지 않고 500은 재시도한다", () => {
    expect(retry(0, new ApiError(499, "C", "x"))).toBe(false);
    expect(retry(0, new ApiError(500, "S", "x"))).toBe(true);
  });

  it("실패 횟수가 2번 미만일 때만 재시도한다", () => {
    const error = new ApiError(500, "S", "x");
    expect(retry(0, error)).toBe(true);
    expect(retry(1, error)).toBe(true);
    expect(retry(2, error)).toBe(false);
  });
});

describe("queryClient mutation 에러 토스트", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useToastStore.getState().hideToast();
  });
  afterEach(() => jest.useRealTimers());

  it("mutation이 실패하면 에러 message로 토스트가 뜬다", async () => {
    await failMutation(new ApiError(400, "BAD", "요청이 잘못됐어요"));

    expect(useToastStore.getState().toast?.message).toBe("요청이 잘못됐어요");
  });

  it("meta.skipToast가 true이면 토스트가 뜨지 않는다", async () => {
    await failMutation(new ApiError(400, "BAD", "요청이 잘못됐어요"), {
      skipToast: true,
    });

    expect(useToastStore.getState().toast).toBeNull();
  });

  it.each([{ skipToast: false }, undefined])(
    "meta가 %j이면 토스트가 뜬다",
    async (meta) => {
      await failMutation(new ApiError(500, "S", "서버 오류"), meta);

      expect(useToastStore.getState().toast?.message).toBe("서버 오류");
    },
  );
});

describe("queryClient 조회 에러 토스트", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useToastStore.getState().hideToast();
  });
  afterEach(() => jest.useRealTimers());

  const failQuery = (error: ApiError, meta?: { skipToast?: boolean }) =>
    queryClient
      .fetchQuery({
        queryKey: ["test", "fail"],
        queryFn: () => Promise.reject(error),
        retry: false,
        meta,
      })
      .catch(() => undefined);

  it("조회가 실패하면 에러 message로 토스트가 뜬다", async () => {
    await failQuery(new ApiError(404, "NOT_FOUND", "기록이 없어요"));

    expect(useToastStore.getState().toast?.message).toBe("기록이 없어요");
  });

  it("meta.skipToast가 true이면 토스트가 뜨지 않는다", async () => {
    await failQuery(new ApiError(404, "NOT_FOUND", "기록이 없어요"), {
      skipToast: true,
    });

    expect(useToastStore.getState().toast).toBeNull();
  });
});
