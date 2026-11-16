import * as SecureStore from "expo-secure-store";

import { queryClient } from "@/lib/query-client";

import { useAuthStore } from "../auth-store";

jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

const setItemAsync = jest.mocked(SecureStore.setItemAsync);
const deleteItemAsync = jest.mocked(SecureStore.deleteItemAsync);
const tokens = { accessToken: "access-1", refreshToken: "refresh-1" };

describe("useAuthStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setItemAsync.mockResolvedValue(undefined);
    deleteItemAsync.mockResolvedValue(undefined);
    useAuthStore.setState({ accessToken: null, refreshToken: null });
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

    it("토큰이 없는 초기 상태에서 호출해도 오류 없이 끝난다", async () => {
      await expect(
        useAuthStore.getState().clearSession(),
      ).resolves.toBeUndefined();
    });

    it("SecureStore 삭제가 실패하면 reject하고 토큰 상태와 캐시를 유지한다", async () => {
      useAuthStore.setState(tokens);
      queryClient.setQueryData(["me"], { name: "홍길동" });
      deleteItemAsync.mockRejectedValueOnce(new Error("삭제 실패"));

      await expect(useAuthStore.getState().clearSession()).rejects.toThrow(
        "삭제 실패",
      );
      expect(useAuthStore.getState().accessToken).toBe("access-1");
      expect(queryClient.getQueryData(["me"])).toEqual({ name: "홍길동" });
    });
  });
});
