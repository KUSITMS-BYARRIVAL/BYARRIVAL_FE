import {
  getMessaging,
  getToken,
  onTokenRefresh,
} from "@react-native-firebase/messaging";

import { getFcmToken, onFcmTokenRefresh } from "../fcm-token";

jest.mock("@react-native-firebase/messaging", () => ({
  getMessaging: jest.fn(() => "messaging"),
  getToken: jest.fn(),
  onTokenRefresh: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getFcmToken", () => {
  it("기본 앱 Messaging의 FCM 토큰을 돌려준다", async () => {
    jest.mocked(getToken).mockResolvedValue("fcm");

    await expect(getFcmToken()).resolves.toBe("fcm");
    expect(getToken).toHaveBeenCalledWith("messaging");
  });

  it("네이티브 모듈이 없으면 throw 대신 reject한다", async () => {
    jest.mocked(getMessaging).mockImplementationOnce(() => {
      throw new Error("native module missing");
    });

    await expect(getFcmToken()).rejects.toThrow("native module missing");
  });
});

describe("onFcmTokenRefresh", () => {
  it("리스너를 등록하고 해제 함수를 돌려준다", () => {
    const unsubscribe = jest.fn();
    jest.mocked(onTokenRefresh).mockReturnValue(unsubscribe);
    const listener = jest.fn();

    expect(onFcmTokenRefresh(listener)).toBe(unsubscribe);
    expect(onTokenRefresh).toHaveBeenCalledWith("messaging", listener);
  });
});
