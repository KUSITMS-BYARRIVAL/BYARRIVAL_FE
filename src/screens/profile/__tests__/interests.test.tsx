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

  it("시안의 8개 분야를 보여주고 현재 관심 분야를 선택해 둔다", async () => {
    await render(<ProfileInterestsScreen />);
    expect(screen.getAllByRole("checkbox")).toHaveLength(8);
    expect(screen.getByRole("checkbox", { name: "경제·금융" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "건강·생활" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "스포츠" })).not.toBeChecked();
  });

  it("누르면 더하고 빼며, 마지막 하나는 뺄 수 없다", async () => {
    const user = userEvent.setup();
    await render(<ProfileInterestsScreen />);
    await user.press(screen.getByRole("checkbox", { name: "스포츠" }));
    expect(useProfileStore.getState().interests).toEqual([
      "economy",
      "health",
      "sports",
    ]);
    await user.press(screen.getByRole("checkbox", { name: "경제·금융" }));
    await user.press(screen.getByRole("checkbox", { name: "건강·생활" }));
    await user.press(screen.getByRole("checkbox", { name: "스포츠" }));
    expect(useProfileStore.getState().interests).toEqual(["sports"]);
  });
});
