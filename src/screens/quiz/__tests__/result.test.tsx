import { render, screen, userEvent } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";

import { QuizResultScreen } from "../result";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({
  router: { dismissTo: jest.fn() },
  useLocalSearchParams: jest.fn(),
}));

describe("QuizResultScreen", () => {
  it("모두 맞히면 축하 문구를 보여주고, 홈으로 돌아갈 수 있다", async () => {
    jest.mocked(useLocalSearchParams).mockReturnValue({
      correct: "3",
      total: "3",
    });
    const user = userEvent.setup();
    await render(<QuizResultScreen />);
    expect(screen.getByText("3/3")).toBeOnTheScreen();
    expect(screen.getByText("모두 맞혔어요!")).toBeOnTheScreen();
    await user.press(screen.getByRole("button", { name: "홈으로 돌아가기" }));
    expect(router.dismissTo).toHaveBeenCalledWith("/");
  });

  it("일부만 맞히면 맞힌 개수를 알려준다", async () => {
    jest.mocked(useLocalSearchParams).mockReturnValue({
      correct: "2",
      total: "3",
    });
    await render(<QuizResultScreen />);
    expect(screen.getByText("2/3")).toBeOnTheScreen();
    expect(screen.getByText("2문제 맞혔어요!")).toBeOnTheScreen();
  });
});
