import { render, screen, userEvent } from "@testing-library/react-native";

import { router } from "expo-router";

import { TODAY_QUIZ } from "@/mocks/quiz";

import { QuizScreen } from "../quiz";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({
  router: { back: jest.fn(), replace: jest.fn() },
}));

const [first, second] = TODAY_QUIZ;

describe("QuizScreen", () => {
  it("첫 문제를 보여주고, 답하기 전에는 다음 문제로 넘어갈 수 없다", async () => {
    await render(<QuizScreen />);
    expect(screen.getByText(first!.question)).toBeOnTheScreen();
    expect(screen.getByRole("progressbar")).toHaveAccessibilityValue({
      now: 1,
      max: 3,
    });
    expect(screen.getByRole("button", { name: "다음 문제" })).toBeDisabled();
  });

  it("정답을 고르면 정답으로 표시하고 다음 문제로 넘어갈 수 있다", async () => {
    const user = userEvent.setup();
    await render(<QuizScreen />);
    const answer = first!.options[first!.answerIndex]!;
    await user.press(screen.getByText(answer));
    expect(
      screen.getByRole("button", {
        name: `${first!.answerIndex + 1} ${answer}`,
      }),
    ).toHaveAccessibilityValue({ text: "정답" });
    await user.press(screen.getByRole("button", { name: "다음 문제" }));
    expect(screen.getByText(second!.question)).toBeOnTheScreen();
  });

  it("오답을 고르면 고른 보기는 흐리게, 정답은 초록으로 두고 해설을 보여준다", async () => {
    const user = userEvent.setup();
    await render(<QuizScreen />);
    const wrongIndex = first!.answerIndex === 0 ? 1 : 0;
    await user.press(screen.getByText(first!.options[wrongIndex]!));
    expect(screen.getByText("아쉬워요, 오답이에요.")).toBeOnTheScreen();
    expect(screen.getByText(first!.explanation)).toBeOnTheScreen();
    const answer = first!.options[first!.answerIndex]!;
    expect(
      screen.getByRole("button", {
        name: `${first!.answerIndex + 1} ${answer}`,
      }),
    ).toHaveAccessibilityValue({ text: "정답" });
  });

  it("마지막 문제까지 풀면 맞힌 개수를 들고 결과 화면으로 넘어간다", async () => {
    const user = userEvent.setup();
    await render(<QuizScreen />);
    // 1번은 틀리고 나머지는 맞힌다
    for (const [i, quiz] of TODAY_QUIZ.entries()) {
      const option = i === 0 ? (quiz.answerIndex + 1) % 3 : quiz.answerIndex;
      await user.press(screen.getByText(quiz.options[option]!));
      const label = i === TODAY_QUIZ.length - 1 ? "결과 보기" : "다음 문제";
      await user.press(screen.getByRole("button", { name: label }));
    }
    expect(router.replace).toHaveBeenCalledWith({
      pathname: "/quiz/result",
      params: { correct: 2, total: 3 },
    });
  });
});
