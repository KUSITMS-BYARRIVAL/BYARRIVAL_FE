import {
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";
import { router } from "expo-router";

import { DialogHost } from "@/screens/_components/dialog-host";
import { useDialogStore } from "@/stores/dialog-store";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { useToastStore } from "@/stores/toast-store";

import { DepartureTimeScreen } from "../departure-time";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({
  router: { back: jest.fn(), push: jest.fn() },
}));

const mockRequestPermission = jest.fn();
jest.mock("@/lib/notification-permission", () => ({
  requestNotificationPermission: () => mockRequestPermission(),
}));
const mockSavePermission = jest.fn();
jest.mock("@/hooks/mutations/use-update-notification-permission", () => ({
  useUpdateNotificationPermission: () => ({ mutate: mockSavePermission }),
}));

const mockUpdate = jest.fn(
  (_body: unknown, options?: { onSuccess?: () => void }) =>
    options?.onSuccess?.(),
);
jest.mock("@/hooks/mutations/use-update-onboarding", () => ({
  useUpdateOnboarding: () => ({
    mutate: mockUpdate,
    isPending: false,
    error: null,
    reset: jest.fn(),
  }),
}));

// 알림 안내 다이얼로그는 앱 루트의 DialogHost가 띄운다
const renderScreen = () =>
  render(
    <>
      <DepartureTimeScreen />
      <DialogHost />
    </>,
  );

beforeEach(() => {
  jest.clearAllMocks();
  mockRequestPermission.mockResolvedValue("GRANTED");
  useToastStore.getState().hideToast();
  useDialogStore.setState({ options: null, isVisible: false });
  useOnboardingStore.setState({
    userType: "worker",
    departureTime: { hour: 8, minute: 0 },
  });
});

describe("DepartureTimeScreen", () => {
  it.each([
    ["worker", "출근은 보통 언제하시나요?"],
    ["student", "등교는 보통 언제하시나요?"],
    ["other", "보통 언제 출발하시나요?"],
  ] as const)("%s 유형이면 '%s'로 묻는다", async (userType, title) => {
    useOnboardingStore.setState({ userType });
    await renderScreen();
    expect(screen.getByRole("header", { name: title })).toBeOnTheScreen();
  });

  it("기본 출발 시각 08:00을 보여주고, 시간 바텀시트는 닫힌 채로 시작한다", async () => {
    await renderScreen();
    expect(screen.getByRole("button", { name: "8시 0분" })).toBeOnTheScreen();
    expect(screen.queryByText("시간 설정")).toBeNull();
  });

  it("시각을 눌러 휠에서 바꾸고 확인하면 저장한다", async () => {
    const user = userEvent.setup();
    await renderScreen();
    await user.press(screen.getByRole("button", { name: "8시 0분" }));
    // 시 휠을 한 칸 올린다 (휠 조절은 접근성 동작으로 보낸다)
    await fireEvent(
      screen.getByRole("adjustable", { name: "시" }),
      "accessibilityAction",
      { nativeEvent: { actionName: "increment" } },
    );
    await user.press(screen.getByRole("button", { name: "확인" }));
    expect(useOnboardingStore.getState().departureTime).toEqual({
      hour: 9,
      minute: 0,
    });
  });

  it.each([
    ["worker", "출근 10분 전에\n오늘의 노선을 알려드릴게요"],
    ["student", "등교 10분 전에\n오늘의 노선을 알려드릴게요"],
    ["other", "출발 10분 전에\n오늘의 노선을 알려드릴게요"],
  ] as const)(
    "%s 유형이면 다음을 눌렀을 때 '%s' 안내를 띄운다",
    async (userType, title) => {
      useOnboardingStore.setState({ userType });
      const user = userEvent.setup();
      await renderScreen();
      await user.press(screen.getByRole("button", { name: "다음으로" }));
      expect(screen.getByRole("header", { name: title })).toBeOnTheScreen();
    },
  );

  it.each(["나중에", "알림 받기"])(
    "알림 안내에서 %s를 누르면 이동 시간 설정으로 넘어간다",
    async (name) => {
      const user = userEvent.setup();
      await renderScreen();
      await user.press(screen.getByRole("button", { name: "다음으로" }));
      // 다음으로는 시각을 저장하고 안내만 띄우며, 이동하지 않는다
      expect(mockUpdate).toHaveBeenLastCalledWith(
        { commuteStartTime: "08:00" },
        expect.anything(),
      );
      expect(router.push).not.toHaveBeenCalled();
      await user.press(screen.getByRole("button", { name }));
      await waitFor(() => expect(router.push).toHaveBeenCalledTimes(1));
      expect(router.push).toHaveBeenCalledWith("/travel-time");
    },
  );

  it("알림 받기는 OS 권한을 묻고 허용 결과를 서버에 저장한다", async () => {
    const user = userEvent.setup();
    await renderScreen();
    await user.press(screen.getByRole("button", { name: "다음으로" }));
    await user.press(screen.getByRole("button", { name: "알림 받기" }));
    await waitFor(() =>
      expect(mockSavePermission).toHaveBeenCalledWith("GRANTED"),
    );
    expect(useToastStore.getState().toast).toBeNull();
  });

  it("알림 권한을 거부하면 저장하고 마이에서 켤 수 있다고 알린 뒤 넘어간다", async () => {
    mockRequestPermission.mockResolvedValue("DENIED");
    const user = userEvent.setup();
    await renderScreen();
    await user.press(screen.getByRole("button", { name: "다음으로" }));
    await user.press(screen.getByRole("button", { name: "알림 받기" }));
    await waitFor(() =>
      expect(router.push).toHaveBeenCalledWith("/travel-time"),
    );
    expect(mockSavePermission).toHaveBeenCalledWith("DENIED");
    expect(useToastStore.getState().toast?.message).toBe(
      "마이 > 알림에서 언제든 켤 수 있어요",
    );
  });

  it("나중에는 OS 권한을 묻지 않고 저장하지도 않는다", async () => {
    const user = userEvent.setup();
    await renderScreen();
    await user.press(screen.getByRole("button", { name: "다음으로" }));
    await user.press(screen.getByRole("button", { name: "나중에" }));
    expect(mockRequestPermission).not.toHaveBeenCalled();
    expect(mockSavePermission).not.toHaveBeenCalled();
  });
});
