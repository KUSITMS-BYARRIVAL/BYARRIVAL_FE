import { render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import { QuizResultScreen } from "../result";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({ router: { dismissTo: jest.fn() } }));
jest.mock("@/hooks/queries/use-get-today-route", () => ({
  useGetTodayRoute: () => ({ data: { route: { routeId: 7 } } }),
}));
const mockResult = jest.fn();
jest.mock("@/hooks/queries/use-get-quiz-result", () => ({
  useGetQuizResult: (routeId: number | undefined) => mockResult(routeId),
}));

const withResult = (correctCount: number, total: number) =>
  mockResult.mockReturnValue({
    data: { total, answeredCount: total, correctCount, finished: true },
  });

describe("QuizResultScreen", () => {
  it("오늘 노선의 결과를 받아 모두 맞히면 축하하고, 홈으로 돌아갈 수 있다", async () => {
    withResult(3, 3);
    const user = userEvent.setup();
    await render(<QuizResultScreen />);
    expect(mockResult).toHaveBeenCalledWith(7);
    expect(screen.getByText("3/3")).toBeOnTheScreen();
    expect(screen.getByText("모두 맞혔어요!")).toBeOnTheScreen();
    await user.press(screen.getByRole("button", { name: "홈으로 돌아가기" }));
    expect(router.dismissTo).toHaveBeenCalledWith("/");
  });

  it("일부만 맞히면 맞힌 개수를 알려준다", async () => {
    withResult(2, 3);
    await render(<QuizResultScreen />);
    expect(screen.getByText("2/3")).toBeOnTheScreen();
    expect(screen.getByText("2문제 맞혔어요!")).toBeOnTheScreen();
  });

  it("낸 문제가 없으면 풀 퀴즈가 없었다고 알린다", async () => {
    withResult(0, 0);
    await render(<QuizResultScreen />);
    expect(screen.getByText("오늘은 풀 퀴즈가 없어요")).toBeOnTheScreen();
  });

  it("결과를 받기 전에는 0/0을 보여주지 않는다", async () => {
    mockResult.mockReturnValue({ data: undefined });
    await render(<QuizResultScreen />);
    expect(screen.queryByText("0/0")).toBeNull();
  });
});
