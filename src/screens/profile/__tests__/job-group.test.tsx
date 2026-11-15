import { render, screen, userEvent } from "@testing-library/react-native";

import { useProfileStore } from "@/stores/profile-store";

import { ProfileJobGroupScreen } from "../job-group";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({ router: { back: jest.fn() } }));

const initial = useProfileStore.getState();

describe("ProfileJobGroupScreen", () => {
  beforeEach(() => useProfileStore.setState(initial, true));

  it("12개 직군 중 현재 직군을 선택해 두고, 다른 직군을 누르면 바로 바꾼다", async () => {
    const user = userEvent.setup();
    await render(<ProfileJobGroupScreen />);
    expect(screen.getAllByRole("radio")).toHaveLength(12);
    expect(screen.getByRole("radio", { name: /IT개발·데이터/ })).toBeChecked();
    await user.press(screen.getByRole("radio", { name: /디자인/ }));
    expect(useProfileStore.getState().jobGroup).toBe("design");
  });
});
