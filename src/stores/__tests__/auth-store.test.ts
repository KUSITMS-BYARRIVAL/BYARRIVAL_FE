import * as SecureStore from "expo-secure-store";

import { queryClient } from "@/lib/query-client";

import { useAuthStore } from "../auth-store";
import { useOnboardingStore } from "../onboarding-store";

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

const getItemAsync = jest.mocked(SecureStore.getItemAsync);
const setItemAsync = jest.mocked(SecureStore.setItemAsync);
const deleteItemAsync = jest.mocked(SecureStore.deleteItemAsync);
const tokens = { accessToken: "access-1", refreshToken: "refresh-1" };

describe("useAuthStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setItemAsync.mockResolvedValue(undefined);
    deleteItemAsync.mockResolvedValue(undefined);
    getItemAsync.mockResolvedValue(null);
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      isOnboarded: false,
      isRestored: false,
    });
    queryClient.clear();
  });

  // 남은 캐시의 gc 타이머가 Jest 종료를 막지 않게 한다
  afterAll(() => queryClient.clear());

  describe("setTokens", () => {
    it("두 토큰을 SecureStore 한 항목에 함께 저장한다", async () => {
      await useAuthStore.getState().setTokens(tokens);

      expect(setItemAsync).toHaveBeenCalledTimes(1);
      const [key, value] = setItemAsync.mock.calls[0]!;
      expect(key).toBe("tokens");
      expect(JSON.parse(value)).toEqual(tokens);
    });

    it("저장이 끝나면 스토어 상태에 토큰이 반영된다", async () => {
      await useAuthStore.getState().setTokens(tokens);

      expect(useAuthStore.getState().accessToken).toBe("access-1");
      expect(useAuthStore.getState().refreshToken).toBe("refresh-1");
    });

    it("SecureStore 저장이 실패하면 reject하고 스토어 토큰은 바뀌지 않는다", async () => {
      setItemAsync.mockRejectedValueOnce(new Error("저장 실패"));

      await expect(useAuthStore.getState().setTokens(tokens)).rejects.toThrow(
        "저장 실패",
      );
      expect(useAuthStore.getState().accessToken).toBeNull();
      expect(useAuthStore.getState().refreshToken).toBeNull();
    });
  });

  describe("clearSession", () => {
    it("SecureStore의 토큰 항목을 삭제한다", async () => {
      await useAuthStore.getState().clearSession();

      expect(deleteItemAsync).toHaveBeenCalledWith("tokens");
    });

    it("스토어 토큰을 null로 되돌린다", async () => {
      useAuthStore.setState(tokens);

      await useAuthStore.getState().clearSession();

      expect(useAuthStore.getState().accessToken).toBeNull();
      expect(useAuthStore.getState().refreshToken).toBeNull();
    });

    it("쿼리 캐시를 비운다", async () => {
      queryClient.setQueryData(["me"], { name: "홍길동" });

      await useAuthStore.getState().clearSession();

      expect(queryClient.getQueryData(["me"])).toBeUndefined();
    });

    it("온보딩 초안을 처음 상태로 되돌린다", async () => {
      useOnboardingStore.setState({ nickname: "홍길동" });

      await useAuthStore.getState().clearSession();

      expect(useOnboardingStore.getState().nickname).toBe("");
    });

    it("토큰이 없는 초기 상태에서 호출해도 오류 없이 끝난다", async () => {
      await expect(
        useAuthStore.getState().clearSession(),
      ).resolves.toBeUndefined();
    });

    it("SecureStore 삭제가 실패해도 앱 안의 토큰 · 캐시는 비우고, 실패는 알린다", async () => {
      useAuthStore.setState({ ...tokens, isOnboarded: true });
      queryClient.setQueryData(["me"], { name: "홍길동" });
      deleteItemAsync.mockRejectedValueOnce(new Error("삭제 실패"));

      await expect(useAuthStore.getState().clearSession()).rejects.toThrow(
        "삭제 실패",
      );
      expect(useAuthStore.getState()).toMatchObject({
        accessToken: null,
        refreshToken: null,
        isOnboarded: false,
      });
      expect(queryClient.getQueryData(["me"])).toBeUndefined();
    });
  });

  describe("restoreSession", () => {
    const stored = (items: Record<string, string>) =>
      getItemAsync.mockImplementation(async (key) => items[key] ?? null);

    it("저장된 토큰과 온보딩 완료 여부를 불러오고 복원 완료로 표시한다", async () => {
      stored({ tokens: JSON.stringify(tokens), onboarded: "true" });

      await useAuthStore.getState().restoreSession();

      expect(useAuthStore.getState()).toMatchObject({
        ...tokens,
        isOnboarded: true,
        isRestored: true,
      });
    });

    it("약관 미동의로 저장된 세션은 약관 미동의로 복원한다", async () => {
      stored({
        tokens: JSON.stringify(tokens),
        onboarded: "false",
        termsAgreed: "false",
      });

      await useAuthStore.getState().restoreSession();

      expect(useAuthStore.getState().isTermsAgreed).toBe(false);
    });

    it("약관 값이 없는 예전 세션은 동의한 것으로 본다", async () => {
      stored({ tokens: JSON.stringify(tokens), onboarded: "false" });

      await useAuthStore.getState().restoreSession();

      expect(useAuthStore.getState().isTermsAgreed).toBe(true);
    });

    it("저장된 토큰이 없으면 비로그인으로 복원 완료한다", async () => {
      await useAuthStore.getState().restoreSession();

      expect(useAuthStore.getState()).toMatchObject({
        accessToken: null,
        isOnboarded: false,
        isRestored: true,
      });
    });

    it("저장 형식이 깨졌으면 비로그인으로 본다", async () => {
      stored({ tokens: "{broken", onboarded: "true" });

      await useAuthStore.getState().restoreSession();

      expect(useAuthStore.getState()).toMatchObject({
        accessToken: null,
        isOnboarded: false,
        isRestored: true,
      });
    });

    it("SecureStore를 읽지 못해도 복원 완료로 표시해 스플래시에 멈추지 않는다", async () => {
      getItemAsync.mockRejectedValue(new Error("읽기 실패"));

      await expect(useAuthStore.getState().restoreSession()).rejects.toThrow();

      expect(useAuthStore.getState().isRestored).toBe(true);
    });
  });

  describe("startSession · setOnboarded", () => {
    it("startSession은 토큰과 온보딩 완료 여부를 함께 저장한다", async () => {
      await useAuthStore
        .getState()
        .startSession({ tokens, isOnboarded: false, isTermsAgreed: false });

      expect(setItemAsync).toHaveBeenCalledWith("onboarded", "false");
      expect(setItemAsync).toHaveBeenCalledWith("termsAgreed", "false");
      expect(useAuthStore.getState()).toMatchObject({
        ...tokens,
        isOnboarded: false,
        isTermsAgreed: false,
      });
    });

    it("setOnboarded는 완료로 저장한다", async () => {
      await useAuthStore.getState().setOnboarded();

      expect(setItemAsync).toHaveBeenCalledWith("onboarded", "true");
      expect(useAuthStore.getState().isOnboarded).toBe(true);
    });

    it("setTermsAgreed는 약관 동의로 저장한다", async () => {
      await useAuthStore.getState().setTermsAgreed();

      expect(setItemAsync).toHaveBeenCalledWith("termsAgreed", "true");
      expect(useAuthStore.getState().isTermsAgreed).toBe(true);
    });

    it("clearSession은 온보딩 완료 · 약관 동의 여부도 지운다", async () => {
      useAuthStore.setState({
        ...tokens,
        isOnboarded: true,
        isTermsAgreed: true,
      });

      await useAuthStore.getState().clearSession();

      expect(deleteItemAsync).toHaveBeenCalledWith("onboarded");
      expect(deleteItemAsync).toHaveBeenCalledWith("termsAgreed");
      expect(useAuthStore.getState()).toMatchObject({
        isOnboarded: false,
        isTermsAgreed: false,
      });
    });
  });
});
