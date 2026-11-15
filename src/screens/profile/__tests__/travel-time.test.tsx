import { render, screen, userEvent } from "@testing-library/react-native";

import { useProfileStore } from "@/stores/profile-store";

import { ProfileTravelTimeScreen } from "../travel-time";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({ router: { back: jest.fn() } }));

const initial = useProfileStore.getState();

describe("ProfileTravelTimeScreen", () => {
  beforeEach(() => useProfileStore.setState(initial, true));

  it("요일별 이동 시간을 보여주고, 0분인 날은 쉬는 날로 표시한다", async () => {
    await render(<ProfileTravelTimeScreen />);
    expect(screen.getByText("약 40분")).toBeOnTheScreen();
    expect(screen.getAllByText("쉬는 날")).toHaveLength(2);
  });

  it("늘리기를 누르면 그 요일만 5분 늘어난다", async () => {
    const user = userEvent.setup();
    await render(<ProfileTravelTimeScreen />);
    // 0: 기본, 1: 월
    await user.press(screen.getAllByRole("button", { name: "늘리기" })[1]!);
    const { byWeekday, base } = useProfileStore.getState().travelMinutes;
    expect(byWeekday.mon).toBe(35);
    expect(base).toBe(30);
  });
});
