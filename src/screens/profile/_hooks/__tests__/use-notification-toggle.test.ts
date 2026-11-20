import { act, renderHook, waitFor } from "@testing-library/react-native";
import { Linking } from "react-native";

import {
  getNotificationPermission,
  requestNotificationPermission,
} from "@/lib/notification-permission";
import { useDialogStore } from "@/stores/dialog-store";

import { useNotificationToggle } from "../use-notification-toggle";

jest.mock("@/lib/notification-permission", () => ({
  getNotificationPermission: jest.fn(),
  requestNotificationPermission: jest.fn(),
}));
let mockSettings: unknown;
jest.mock("@/hooks/queries/use-get-notification-settings", () => ({
  useGetNotificationSettings: () => ({ data: mockSettings }),
}));
const mockUpdateSettings = jest.fn();
jest.mock("@/hooks/mutations/use-update-notification-settings", () => ({
  useUpdateNotificationSettings: () => ({
    mutate: mockUpdateSettings,
    isPending: false,
  }),
}));
const mockSavePermission = jest.fn();
jest.mock("@/hooks/mutations/use-update-notification-permission", () => ({
  useUpdateNotificationPermission: () => ({ mutate: mockSavePermission }),
}));

const getPermission = jest.mocked(getNotificationPermission);
const requestPermission = jest.mocked(requestNotificationPermission);
const settings = (permission: string, enabled: boolean) => ({
  permission,
  settings: [{ category: "ACTIVITY", enabled }],
});
const activity = (enabled: boolean) => ({
  settings: [{ category: "ACTIVITY", enabled }],
});

beforeEach(() => {
  jest.clearAllMocks();
  mockSettings = settings("GRANTED", true);
  getPermission.mockResolvedValue({ permission: "GRANTED", canAskAgain: true });
});

describe("useNotificationToggle", () => {
  it("OS 권한이 허용이고 수신 설정이 켜져 있어야 켜짐이다", async () => {
    const { result, rerender } = await renderHook(() =>
      useNotificationToggle(),
    );
    expect(result.current.isOn).toBe(true);

    mockSettings = settings("GRANTED", false);
    await rerender({});
    expect(result.current.isOn).toBe(false);

    mockSettings = settings("DENIED", true);
    getPermission.mockResolvedValue({
      permission: "DENIED",
      canAskAgain: true,
    });
    await rerender({});
    expect(result.current.isOn).toBe(false);
  });

  it("끄면 수신 설정만 끄고 권한은 건드리지 않는다", async () => {
    const { result } = await renderHook(() => useNotificationToggle());
    await act(() => result.current.toggle(false));
    expect(mockUpdateSettings).toHaveBeenCalledWith(activity(false));
    expect(requestPermission).not.toHaveBeenCalled();
  });

  it("아직 묻지 않은 권한이면 켤 때 팝업으로 묻고 결과를 저장한다", async () => {
    mockSettings = settings("DENIED", false);
    getPermission.mockResolvedValue({
      permission: "DENIED",
      canAskAgain: true,
    });
    requestPermission.mockResolvedValue("GRANTED");
    const { result } = await renderHook(() => useNotificationToggle());

    await act(() => result.current.toggle(true));

    expect(mockUpdateSettings).toHaveBeenCalledWith(activity(true));
    expect(mockSavePermission).toHaveBeenCalledWith("GRANTED");
  });

  it("다시 물을 수 없는 권한이면 켤 때 다이얼로그에서 '이동'을 눌러야 휴대폰 설정을 연다", async () => {
    mockSettings = settings("DENIED", false);
    getPermission.mockResolvedValue({
      permission: "DENIED",
      canAskAgain: false,
    });
    const openSettings = jest
      .spyOn(Linking, "openSettings")
      .mockResolvedValue(undefined);
    const { result } = await renderHook(() => useNotificationToggle());

    await act(() => result.current.toggle(true));

    const dialog = useDialogStore.getState().options;
    expect(dialog?.title).toBe("알림 권한이 꺼져 있어요");
    expect(openSettings).not.toHaveBeenCalled();
    expect(requestPermission).not.toHaveBeenCalled();

    dialog?.onConfirm();
    expect(openSettings).toHaveBeenCalled();
  });

  it("휴대폰 설정에서 바뀐 권한이 서버 값과 다르면 저장한다", async () => {
    mockSettings = settings("DENIED", true);
    getPermission.mockResolvedValue({
      permission: "GRANTED",
      canAskAgain: true,
    });
    await renderHook(() => useNotificationToggle());
    await waitFor(() =>
      expect(mockSavePermission).toHaveBeenCalledWith("GRANTED"),
    );
  });
});
