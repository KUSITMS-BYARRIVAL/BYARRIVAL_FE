import {
  getInitialNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  type RemoteMessage,
} from "@react-native-firebase/messaging";

import {
  getFcmToken,
  onFcmTokenRefresh,
  onForegroundPush,
  onPushOpened,
} from "../fcm-token";

jest.mock("@react-native-firebase/messaging", () => ({
  getMessaging: jest.fn(() => "messaging"),
  getToken: jest.fn(),
  onTokenRefresh: jest.fn(),
  getInitialNotification: jest.fn(),
  onNotificationOpenedApp: jest.fn(),
  onMessage: jest.fn(),
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

describe("onPushOpened", () => {
  const data = { notificationId: "104", type: "SMALLTALK", smalltalkId: "3" };

  it("꺼진 상태에서 푸시로 열렸으면 그 푸시의 data를 넘긴다", async () => {
    jest
      .mocked(getInitialNotification)
      .mockResolvedValue({ data } as RemoteMessage);
    const listener = jest.fn();

    onPushOpened(listener);

    await waitForPromises();
    expect(listener).toHaveBeenCalledWith(data);
  });

  it("푸시로 열리지 않았으면 넘기지 않는다", async () => {
    jest.mocked(getInitialNotification).mockResolvedValue(null);
    const listener = jest.fn();

    onPushOpened(listener);

    await waitForPromises();
    expect(listener).not.toHaveBeenCalled();
  });

  it("백그라운드에서 푸시로 열리면 data를 넘기고, 해제하면 구독을 끊는다", () => {
    jest.mocked(getInitialNotification).mockResolvedValue(null);
    const unsubscribe = jest.fn();
    jest.mocked(onNotificationOpenedApp).mockReturnValue(unsubscribe);
    const listener = jest.fn();

    const off = onPushOpened(listener);
    const handle = jest.mocked(onNotificationOpenedApp).mock.calls[0]![1];
    handle({ data } as RemoteMessage);
    expect(listener).toHaveBeenCalledWith(data);

    off();
    expect(unsubscribe).toHaveBeenCalled();
  });

  it("초기 알림 조회가 끝나기 전에 해제하면 넘기지 않는다", async () => {
    jest
      .mocked(getInitialNotification)
      .mockResolvedValue({ data } as RemoteMessage);
    jest.mocked(onNotificationOpenedApp).mockReturnValue(jest.fn());
    const listener = jest.fn();

    onPushOpened(listener)();

    await waitForPromises();
    expect(listener).not.toHaveBeenCalled();
  });

  it("다시 구독해도 이미 처리한 푸시(messageId)는 또 넘기지 않는다", async () => {
    jest
      .mocked(getInitialNotification)
      .mockResolvedValue({ messageId: "m-1", data } as RemoteMessage);
    jest.mocked(onNotificationOpenedApp).mockReturnValue(jest.fn());
    const listener = jest.fn();

    onPushOpened(listener);
    onPushOpened(listener);

    await waitForPromises();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe("onForegroundPush", () => {
  it("포그라운드 메시지 리스너를 등록하고 해제 함수를 돌려준다", () => {
    const unsubscribe = jest.fn();
    jest.mocked(onMessage).mockReturnValue(unsubscribe);
    const listener = jest.fn();

    expect(onForegroundPush(listener)).toBe(unsubscribe);
    expect(onMessage).toHaveBeenCalledWith("messaging", listener);
  });
});

const waitForPromises = () =>
  new Promise<void>((resolve) => setImmediate(resolve));
