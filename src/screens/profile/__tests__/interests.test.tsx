import { render, screen, userEvent } from "@testing-library/react-native";

import { useProfileStore } from "@/stores/profile-store";

import { ProfileInterestsScreen } from "../interests";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({ router: { back: jest.fn() } }));

const initial = useProfileStore.getState();

describe("ProfileInterestsScreen", () => {
  beforeEach(() => useProfileStore.setState(initial, true));

  it("누르면 관심 분야를 더하고 빼며, 마지막 하나는 뺄 수 없다", async () => {
    const user = userEvent.setup();
    await render(<ProfileInterestsScreen />);
    await user.press(screen.getByText("문화"));
    expect(useProfileStore.getState().interests).toEqual([
      "economy",
      "tech",
      "culture",
    ]);
    await user.press(screen.getByText("경제"));
    await user.press(screen.getByText("테크"));
    expect(useProfileStore.getState().interests).toEqual(["culture"]);
    await user.press(screen.getByText("문화"));
    expect(useProfileStore.getState().interests).toEqual(["culture"]);
  });
});
