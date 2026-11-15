import { render, screen, userEvent } from "@testing-library/react-native";

import { useProfileStore } from "@/stores/profile-store";

import { ProfileRegionScreen } from "../region";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({ router: { back: jest.fn() } }));

const initial = useProfileStore.getState();

describe("ProfileRegionScreen", () => {
  beforeEach(() => useProfileStore.setState(initial, true));

  it("현재 지역을 칩으로 보여주고, 검색 결과를 고르면 바로 바꾼다", async () => {
    const user = userEvent.setup();
    await render(<ProfileRegionScreen />);
    expect(screen.getByText("서울 강남구")).toBeOnTheScreen();
    await user.type(screen.getByLabelText("지역명 검색"), "해운대");
    await user.press(screen.getByRole("button", { name: "부산 해운대구" }));
    expect(useProfileStore.getState().region).toEqual({
      province: "부산",
      district: "해운대구",
    });
  });
});
