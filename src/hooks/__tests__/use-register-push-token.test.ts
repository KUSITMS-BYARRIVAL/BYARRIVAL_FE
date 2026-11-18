import { renderHook, waitFor } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import { act } from "react";

import { baseApi } from "@/lib/api-client";
import { getFcmToken, onFcmTokenRefresh } from "@/lib/fcm-token";
import { useAuthStore } from "@/stores/auth-store";

import { useRegisterPushToken } from "../use-register-push-token";

jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("@/lib/fcm-token", () => ({
  getFcmToken: jest.fn(),
  onFcmTokenRefresh: jest.fn(),
}));

const api = new MockAdapter(baseApi);
const unsubscribe = jest.fn();

beforeEach(() => {
  api.reset();
  jest.clearAllMocks();
  api.onPut("/devices").reply(200, { data: null });
  jest.mocked(getFcmToken).mockResolvedValue("fcm");
  jest.mocked(onFcmTokenRefresh).mockReturnValue(unsubscribe);
});

describe("useRegisterPushToken", () => {
  it("로그인 상태면 토큰과 플랫폼을 PUT /devices로 등록한다", async () => {
    useAuthStore.setState({ accessToken: "access" });

    await renderHook(() => useRegisterPushToken());

    await waitFor(() => expect(api.history.put).toHaveLength(1));
    expect(JSON.parse(api.history.put[0]!.data)).toEqual({
      fcmToken: "fcm",
      platform: "IOS",
    });
  });

  it("토큰이 바뀌면 새 토큰으로 다시 등록한다", async () => {
    useAuthStore.setState({ accessToken: "access" });
    await renderHook(() => useRegisterPushToken());
    await waitFor(() => expect(api.history.put).toHaveLength(1));

    const listener = jest.mocked(onFcmTokenRefresh).mock.calls[0]![0];
    await act(() => listener("new-fcm"));

    expect(JSON.parse(api.history.put[1]!.data).fcmToken).toBe("new-fcm");
  });

  it("비로그인 상태면 등록하지 않고, 로그아웃하면 구독을 해제한다", async () => {
    useAuthStore.setState({ accessToken: "access" });
    await renderHook(() => useRegisterPushToken());
    await waitFor(() => expect(api.history.put).toHaveLength(1));

    await act(() => useAuthStore.setState({ accessToken: null }));

    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(api.history.put).toHaveLength(1);
  });

  it("토큰을 못 얻어도 에러 없이 넘어간다", async () => {
    jest.mocked(getFcmToken).mockRejectedValue(new Error("no token"));
    useAuthStore.setState({ accessToken: "access" });

    await renderHook(() => useRegisterPushToken());

    await waitFor(() => expect(getFcmToken).toHaveBeenCalled());
    expect(api.history.put).toHaveLength(0);
  });
});
