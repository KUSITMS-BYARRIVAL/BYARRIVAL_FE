import { renderHook } from "@testing-library/react-native";

import { useMarkNotificationRead } from "@/hooks/mutations/use-mark-notification-read";
import { onPushOpened } from "@/lib/fcm-token";
import { openNotification } from "@/screens/notifications/_helpers";

import { useOpenPushNotification } from "../use-open-push-notification";

jest.mock("@/lib/fcm-token", () => ({ onPushOpened: jest.fn() }));
jest.mock("@/screens/notifications/_helpers", () => ({
  openNotification: jest.fn(),
}));
jest.mock("@/hooks/mutations/use-mark-notification-read", () => ({
  useMarkNotificationRead: jest.fn(),
}));

const markRead = jest.fn();
const unsubscribe = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .mocked(useMarkNotificationRead)
    .mockReturnValue({ mutate: markRead } as never);
  jest.mocked(onPushOpened).mockReturnValue(unsubscribe);
});

const openPush = async (data: Record<string, string>) => {
  await renderHook(() => useOpenPushNotification());
  jest.mocked(onPushOpened).mock.calls[0]![0](data);
};

describe("useOpenPushNotification", () => {
  it("푸시를 누르면 알림을 읽음 처리하고 나머지 키를 params로 화면을 연다", async () => {
    await openPush({
      notificationId: "7",
      type: "SMALLTALK",
      smalltalkId: "3",
    });

    expect(markRead).toHaveBeenCalledWith(7);
    expect(openNotification).toHaveBeenCalledWith("SMALLTALK", {
      smalltalkId: "3",
    });
  });

  it.each<[string, Record<string, string>]>([
    ["없으면", { type: "SMALLTALK" }],
    ["숫자가 아니면", { notificationId: "abc", type: "SMALLTALK" }],
  ])("notificationId가 %s 읽음 처리 없이 화면만 연다", async (_, data) => {
    await openPush(data);

    expect(markRead).not.toHaveBeenCalled();
    expect(openNotification).toHaveBeenCalledWith("SMALLTALK", {});
  });

  it("type이 없으면 빈 유형으로 넘겨 알림함으로 보낸다", async () => {
    await openPush({ notificationId: "7" });

    expect(openNotification).toHaveBeenCalledWith("", {});
  });

  it("언마운트하면 푸시 구독을 해제한다", async () => {
    const { unmount } = await renderHook(() => useOpenPushNotification());

    await unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});
