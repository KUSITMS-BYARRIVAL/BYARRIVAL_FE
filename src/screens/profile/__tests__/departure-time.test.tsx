import {
  fireEvent,
  render,
  screen,
  userEvent,
} from "@testing-library/react-native";

import { useProfileStore } from "@/stores/profile-store";

import { ProfileDepartureTimeScreen } from "../departure-time";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({ router: { back: jest.fn() } }));

const initial = useProfileStore.getState();

describe("ProfileDepartureTimeScreen", () => {
  beforeEach(() => useProfileStore.setState(initial, true));

  it("요일별 출근 시각을 보여주고, 이동 시간이 0분인 날은 누를 수 없다", async () => {
    await render(<ProfileDepartureTimeScreen />);
    expect(
      screen.getByRole("button", { name: "목 오후 01:00" }),
    ).toBeOnTheScreen();
    expect(
      screen.getByRole("button", { name: "토 오전 08:00" }),
    ).toBeDisabled();
  });

  it("요일 시간을 누르면 시간 설정 시트가 열리고, 바꾼 시각을 확인하면 저장해 보여준다", async () => {
    const user = userEvent.setup();
    await render(<ProfileDepartureTimeScreen />);
    await user.press(screen.getByRole("button", { name: "화 오전 09:00" }));
    expect(screen.getByText("시간 설정")).toBeOnTheScreen();
    // 시 휠을 한 칸 올려 9시 → 10시
    await fireEvent(
      screen.getByRole("adjustable", { name: "시" }),
      "accessibilityAction",
      { nativeEvent: { actionName: "increment" } },
    );
    await user.press(screen.getByRole("button", { name: "확인" }));
    expect(useProfileStore.getState().departureTimes.byWeekday.tue).toEqual({
      hour: 10,
      minute: 0,
    });
    expect(
      screen.getByRole("button", { name: "화 오전 10:00" }),
    ).toBeOnTheScreen();
    // 기본과 다른 요일은 그대로다
    expect(
      screen.getByRole("button", { name: "기본 오전 08:00" }),
    ).toBeOnTheScreen();
    expect(
      screen.getByRole("button", { name: "월 오전 08:00" }),
    ).toBeOnTheScreen();
  });
});
