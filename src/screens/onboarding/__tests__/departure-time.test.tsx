import {
  fireEvent,
  render,
  screen,
  userEvent,
} from "@testing-library/react-native";
import { router } from "expo-router";

import { useOnboardingStore } from "@/stores/onboarding-store";

import { DepartureTimeScreen } from "../departure-time";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({
  router: { back: jest.fn(), push: jest.fn() },
}));

beforeEach(() =>
  useOnboardingStore.setState({
    userType: "worker",
    departureTime: { hour: 8, minute: 0 },
  }),
);

describe("DepartureTimeScreen", () => {
  it.each([
    ["worker", "출근은 보통 언제하시나요?"],
    ["student", "등교는 보통 언제하시나요?"],
    ["other", "보통 언제 출발하시나요?"],
  ] as const)("%s 유형이면 '%s'로 묻는다", async (userType, title) => {
    useOnboardingStore.setState({ userType });
    await render(<DepartureTimeScreen />);
    expect(screen.getByRole("header", { name: title })).toBeOnTheScreen();
  });

  it("기본 출발 시각 08:00을 보여주고, 시간 바텀시트는 닫힌 채로 시작한다", async () => {
    await render(<DepartureTimeScreen />);
    expect(screen.getByRole("button", { name: "8시 0분" })).toBeOnTheScreen();
    expect(screen.queryByText("시간 설정")).toBeNull();
  });

  it("시각을 눌러 휠에서 바꾸고 확인하면 저장한다", async () => {
    const user = userEvent.setup();
    await render(<DepartureTimeScreen />);
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

  it("다음을 누르면 알림 권한 안내를 띄운다", async () => {
    const user = userEvent.setup();
    await render(<DepartureTimeScreen />);
    await user.press(screen.getByRole("button", { name: "다음으로" }));
    expect(
      screen.getByRole("header", {
        name: "출근 10분 전에 오늘의 노선을 알려드릴게요",
      }),
    ).toBeOnTheScreen();
  });

  it.each(["나중에", "알림 받기"])(
    "알림 안내에서 %s를 누르면 이동 시간 설정으로 넘어간다",
    async (name) => {
      const user = userEvent.setup();
      await render(<DepartureTimeScreen />);
      await user.press(screen.getByRole("button", { name: "다음으로" }));
      await user.press(screen.getByRole("button", { name }));
      expect(router.push).toHaveBeenCalledWith("/travel-time");
    },
  );
});
