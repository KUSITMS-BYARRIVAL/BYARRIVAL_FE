import axios, { type AxiosRequestConfig } from "axios";
import MockAdapter from "axios-mock-adapter";

import { useAuthStore } from "@/stores/auth-store";
import { ApiError } from "@/types/api";

import { baseApi } from "../api-client";

jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

const REISSUE_URL = /\/auth\/reissue$/;
const newTokens = { accessToken: "new-access", refreshToken: "new-refresh" };

const api = new MockAdapter(baseApi);
const reissue = new MockAdapter(axios);

// 새 accessToken이 붙은 요청만 성공시켜 재시도 결과를 구분한다
const replyByToken = (config: AxiosRequestConfig): [number, unknown] =>
  config.headers?.Authorization === "Bearer new-access"
    ? [200, { ok: true }]
    : [401, { code: "EXPIRED", message: "만료" }];

const caught = async (promise: Promise<unknown>) =>
  promise.then(
    () => undefined,
    (e: unknown) => e as ApiError,
  );

describe("baseApi 요청 인터셉터", () => {
  beforeEach(() => {
    api.reset();
    useAuthStore.setState({ accessToken: null, refreshToken: null });
  });

  it("accessToken이 있으면 Authorization 헤더를 Bearer로 붙인다", async () => {
    useAuthStore.setState({ accessToken: "token-1" });
    api.onGet("/me").reply(200, {});

    await baseApi.get("/me");

    expect(api.history.get[0].headers?.Authorization).toBe("Bearer token-1");
  });

  it("accessToken이 null이면 Authorization 헤더를 붙이지 않는다", async () => {
    api.onGet("/me").reply(200, {});

    await baseApi.get("/me");

    expect(api.history.get[0].headers?.Authorization).toBeUndefined();
  });

  it("baseURL은 /api/v1로 끝나고 timeout은 10초다", () => {
    expect(baseApi.defaults.baseURL).toMatch(/\/api\/v1$/);
    expect(baseApi.defaults.timeout).toBe(10000);
  });
});

describe("baseApi 응답 인터셉터 (재발급 대상이 아닌 에러)", () => {
  beforeEach(() => {
    api.reset();
    reissue.reset();
    useAuthStore.setState({ accessToken: null, refreshToken: null });
  });

  it("성공 응답은 그대로 통과한다", async () => {
    api.onGet("/me").reply(200, { name: "홍길동" });

    const res = await baseApi.get("/me");

    expect(res.data).toEqual({ name: "홍길동" });
  });

  it("4xx 응답은 서버가 준 code와 message를 담은 ApiError로 reject된다", async () => {
    api.onGet("/me").reply(400, { code: "BAD", message: "잘못된 요청" });

    const error = await caught(baseApi.get("/me"));

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 400,
      code: "BAD",
      message: "잘못된 요청",
    });
  });

  it("응답 없는 네트워크 에러는 status null, NETWORK_ERROR인 ApiError로 reject된다", async () => {
    api.onGet("/me").networkError();

    const error = await caught(baseApi.get("/me"));

    expect(error).toMatchObject({ status: null, code: "NETWORK_ERROR" });
  });

  it("401이어도 refreshToken이 없으면 재발급 없이 ApiError(401)로 reject된다", async () => {
    api.onGet("/me").reply(401, { code: "EXPIRED", message: "만료" });

    const error = await caught(baseApi.get("/me"));

    expect(error).toMatchObject({ status: 401, code: "EXPIRED" });
    expect(reissue.history.post).toHaveLength(0);
  });
});

describe("baseApi 401 토큰 재발급", () => {
  beforeEach(() => {
    api.reset();
    reissue.reset();
    useAuthStore.setState({
      accessToken: "old-access",
      refreshToken: "old-refresh",
    });
  });

  it("재발급에 성공하면 새 토큰을 저장하고 원래 요청을 재시도해 성공 응답을 돌려준다", async () => {
    api.onGet("/me").reply(replyByToken);
    reissue.onPost(REISSUE_URL).reply(200, { data: newTokens });

    const res = await baseApi.get("/me");

    expect(res.data).toEqual({ ok: true });
    expect(useAuthStore.getState().accessToken).toBe("new-access");
    expect(api.history.get).toHaveLength(2);
  });

  it("재발급 요청은 refreshToken을 body에 담아 보낸다", async () => {
    api.onGet("/me").reply(replyByToken);
    reissue.onPost(REISSUE_URL).reply(200, { data: newTokens });

    await baseApi.get("/me");

    expect(JSON.parse(reissue.history.post[0].data)).toEqual({
      refreshToken: "old-refresh",
    });
  });

  it("재발급이 실패하면 세션을 비우고 원래 401을 ApiError로 reject한다", async () => {
    api.onGet("/me").reply(401, { code: "EXPIRED", message: "만료" });
    reissue.onPost(REISSUE_URL).reply(401, {});

    const error = await caught(baseApi.get("/me"));

    expect(error).toMatchObject({ status: 401, code: "EXPIRED" });
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().refreshToken).toBeNull();
  });

  it.each([
    [
      "네트워크 끊김",
      () => reissue.onPost(REISSUE_URL).networkError(),
      { status: null, code: "NETWORK_ERROR" },
    ],
    [
      "5xx",
      () =>
        reissue
          .onPost(REISSUE_URL)
          .reply(503, { code: "SERVER_ERROR", message: "점검 중" }),
      { status: 503, code: "SERVER_ERROR" },
    ],
  ])(
    "재발급이 %s로 실패하면 세션을 유지하고 401 대신 그 에러를 reject한다",
    async (_, mockReissueFailure, expected) => {
      api.onGet("/me").reply(401, { code: "EXPIRED", message: "만료" });
      mockReissueFailure();

      const error = await caught(baseApi.get("/me"));

      expect(error).toMatchObject(expected);
      expect(useAuthStore.getState().refreshToken).not.toBeNull();
    },
  );

  it("재시도한 요청이 또 401이면 재발급을 반복하지 않고 reject된다", async () => {
    api.onGet("/me").reply(401, { code: "EXPIRED", message: "만료" });
    reissue.onPost(REISSUE_URL).reply(200, { data: newTokens });

    const error = await caught(baseApi.get("/me"));

    expect(error).toMatchObject({ status: 401 });
    expect(reissue.history.post).toHaveLength(1);
    expect(api.history.get).toHaveLength(2);
  });

  it("동시에 401이 여러 건이어도 재발급은 1번만 하고 모두 재시도한다", async () => {
    api.onGet(/\/item\/\d/).reply(replyByToken);
    reissue.onPost(REISSUE_URL).reply(200, { data: newTokens });

    const results = await Promise.all([
      baseApi.get("/item/1"),
      baseApi.get("/item/2"),
      baseApi.get("/item/3"),
    ]);

    expect(results.map((r) => r.status)).toEqual([200, 200, 200]);
    expect(reissue.history.post).toHaveLength(1);
  });

  it("재발급이 끝난 뒤 다시 401이 나면 새로 재발급을 시도한다", async () => {
    api.onGet("/me").reply(replyByToken);
    reissue.onPost(REISSUE_URL).reply(200, { data: newTokens });
    await baseApi.get("/me");

    useAuthStore.setState({
      accessToken: "old-access",
      refreshToken: "old-refresh",
    });
    await baseApi.get("/me");

    expect(reissue.history.post).toHaveLength(2);
  });
});
