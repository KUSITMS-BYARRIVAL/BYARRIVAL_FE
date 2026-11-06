import { render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import { IntroScreen } from "../intro";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({ router: { replace: jest.fn() } }));

describe("IntroScreen", () => {
  it("화면을 누르면 로그인 화면으로 넘어간다", async () => {
    const user = userEvent.setup();
    await render(<IntroScreen />);
    await user.press(screen.getByRole("button", { name: "도착까지 시작하기" }));
    expect(router.replace).toHaveBeenCalledWith("/sign-in");
  });
});
