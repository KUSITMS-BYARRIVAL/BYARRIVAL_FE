import { render, screen, userEvent } from "@testing-library/react-native";

import { useProfileStore } from "@/stores/profile-store";

import { ProfileUserTypeScreen } from "../user-type";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({ router: { back: jest.fn() } }));

const initial = useProfileStore.getState();

describe("ProfileUserTypeScreen", () => {
  beforeEach(() => useProfileStore.setState(initial, true));

  it("현재 유형을 선택한 상태로 보여주고, 다른 유형을 누르면 바로 바꾼다", async () => {
    const user = userEvent.setup();
    await render(<ProfileUserTypeScreen />);
    expect(screen.getByRole("radio", { name: /직장인/ })).toBeChecked();
    await user.press(screen.getByRole("radio", { name: /학생/ }));
    expect(useProfileStore.getState().userType).toBe("student");
  });
});
