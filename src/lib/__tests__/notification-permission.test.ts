import {
  requestPermissionsAsync,
  setNotificationChannelAsync,
} from "expo-notifications";
import { Platform } from "react-native";

import { requestNotificationPermission } from "../notification-permission";

jest.mock("expo-notifications", () => ({
  requestPermissionsAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn().mockResolvedValue(null),
  AndroidImportance: { DEFAULT: 3 },
  IosAuthorizationStatus: { PROVISIONAL: 3 },
}));

const request = jest.mocked(requestPermissionsAsync);
const setChannel = jest.mocked(setNotificationChannelAsync);

afterEach(() => {
  Platform.OS = "ios";
});

describe("requestNotificationPermission", () => {
  it("허용하면 GRANTED", async () => {
    request.mockResolvedValue({ granted: true } as never);
    await expect(requestNotificationPermission()).resolves.toBe("GRANTED");
  });

  it("거부하면 DENIED", async () => {
    request.mockResolvedValue({ granted: false, ios: { status: 1 } } as never);
    await expect(requestNotificationPermission()).resolves.toBe("DENIED");
  });

  it("iOS 임시 허용(provisional)은 GRANTED로 본다", async () => {
    request.mockResolvedValue({ granted: false, ios: { status: 3 } } as never);
    await expect(requestNotificationPermission()).resolves.toBe("GRANTED");
  });

  it("Android는 권한 팝업이 뜨도록 알림 채널을 먼저 만든다", async () => {
    Platform.OS = "android";
    request.mockResolvedValue({ granted: true } as never);

    await requestNotificationPermission();

    expect(setChannel).toHaveBeenCalledWith(
      "default",
      expect.objectContaining({ importance: 3 }),
    );
  });
});
