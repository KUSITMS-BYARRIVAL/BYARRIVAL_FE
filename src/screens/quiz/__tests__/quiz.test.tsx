import { render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import type { Quiz, QuizAnswer, QuizSet } from "@/types/quiz/quiz.types";

import { QuizScreen } from "../quiz";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({
  router: { back: jest.fn(), replace: jest.fn() },
}));

const mockRoute = jest.fn();
jest.mock("@/hooks/queries/use-get-today-route", () => ({
  useGetTodayRoute: () => mockRoute(),
}));
const mockQuizzes = jest.fn();
jest.mock("@/hooks/queries/use-get-quizzes", () => ({
  useGetQuizzes: (routeId: number | undefined) => mockQuizzes(routeId),
}));
const mockAnswer = jest.fn();
jest.mock("@/hooks/mutations/use-answer-quiz", () => ({
  useAnswerQuiz: () => ({ mutate: mockAnswer, isPending: false }),
}));

const quiz = (order: number): Quiz => ({
  quizOrder: order,
  quizId: order * 10,
  categoryId: 4,
  categoryName: "경제",
  articleId: order,
  articleTitle: `기사 ${order}`,
  question: `문제 ${order}`,
  choices: [
    { seq: 1, content: `${order}-가` },
    { seq: 2, content: `${order}-나` },
    { seq: 3, content: `${order}-다` },
  ],
  answered: false,
  selectedSeq: null,
  correct: null,
  answerSeq: null,
  explanation: null,
});

const quizSet = (overrides?: Partial<QuizSet>): QuizSet => ({
  routeId: 7,
  nextQuizOrder: 1,
  quizzes: [quiz(1), quiz(2)],
  progress: { total: 2, answeredCount: 0, correctCount: 0, finished: false },
  ...overrides,
});

// 서버 채점 결과를 바로 돌려준다
const grade = (answerSeq: number, explanation = "해설") =>
  mockAnswer.mockImplementation(
    (
      { choiceSeq }: { choiceSeq: number },
      options: { onSuccess: (data: QuizAnswer) => void },
    ) =>
      options.onSuccess({
        quizId: 10,
        selectedSeq: choiceSeq,
        answerSeq,
        correct: choiceSeq === answerSeq,
        explanation,
        progress: {
          total: 2,
          answeredCount: 1,
          correctCount: 0,
          finished: false,
        },
      }),
  );

beforeEach(() => {
  jest.clearAllMocks();
  mockRoute.mockReturnValue({
    data: { state: "COMPLETED", route: { routeId: 7 } },
    isPending: false,
  });
  mockQuizzes.mockReturnValue({ data: quizSet(), isPending: false });
});

describe("QuizScreen", () => {
  it("오늘 노선의 퀴즈를 받아 첫 문제를 보여주고, 답하기 전에는 넘어갈 수 없다", async () => {
    await render(<QuizScreen />);
    expect(mockQuizzes).toHaveBeenCalledWith(7);
    expect(screen.getByText("문제 1")).toBeOnTheScreen();
    expect(screen.getByText("기사 1")).toBeOnTheScreen();
    expect(screen.getByRole("progressbar")).toHaveAccessibilityValue({
      now: 1,
      max: 2,
    });
    expect(screen.getByRole("button", { name: "다음 문제" })).toBeDisabled();
  });

  it("보기를 누르면 서버에 답을 보내고, 정답이면 정답 표시와 해설을 보여준 뒤 다음 문제로 넘어간다", async () => {
    grade(2, "나가 정답인 이유");
    const user = userEvent.setup();
    await render(<QuizScreen />);
    await user.press(screen.getByText("1-나"));
    expect(mockAnswer).toHaveBeenCalledWith(
      { routeId: 7, quizId: 10, choiceSeq: 2 },
      expect.anything(),
    );
    expect(
      screen.getByRole("button", { name: "2 1-나" }),
    ).toHaveAccessibilityValue({ text: "정답" });
    expect(screen.getByText("정답이에요!")).toBeOnTheScreen();
    expect(screen.getByText("나가 정답인 이유")).toBeOnTheScreen();
    await user.press(screen.getByRole("button", { name: "다음 문제" }));
    expect(screen.getByText("문제 2")).toBeOnTheScreen();
  });

  it("오답이면 서버가 준 해설을 보여준다", async () => {
    grade(3, "정답은 다예요");
    const user = userEvent.setup();
    await render(<QuizScreen />);
    await user.press(screen.getByText("1-가"));
    expect(screen.getByText("아쉬워요, 오답이에요.")).toBeOnTheScreen();
    expect(screen.getByText("정답은 다예요")).toBeOnTheScreen();
  });

  it("다시 들어오면 서버가 알려준 문제부터 이어서 풀고, 마지막 문제 뒤에는 결과로 간다", async () => {
    mockQuizzes.mockReturnValue({
      data: quizSet({ nextQuizOrder: 2 }),
      isPending: false,
    });
    grade(1);
    const user = userEvent.setup();
    await render(<QuizScreen />);
    expect(screen.getByText("문제 2")).toBeOnTheScreen();
    await user.press(screen.getByText("2-가"));
    await user.press(screen.getByRole("button", { name: "결과 보기" }));
    expect(router.replace).toHaveBeenCalledWith("/quiz/result");
  });

  it("답한 뒤 서버의 이어 풀 문제가 바뀌어도, 다음 문제를 누르기 전까지 지금 문제에 머문다", async () => {
    // 답하면 다시 받은 퀴즈 목록에서 nextQuizOrder가 2로 오른다
    grade(2);
    const answer = mockAnswer.getMockImplementation()!;
    mockAnswer.mockImplementation((body, options) => {
      mockQuizzes.mockReturnValue({
        data: quizSet({ nextQuizOrder: 2 }),
        isPending: false,
      });
      answer(body, options);
    });
    const user = userEvent.setup();
    await render(<QuizScreen />);
    await user.press(screen.getByText("1-나"));
    expect(screen.getByText("문제 1")).toBeOnTheScreen();
    await user.press(screen.getByRole("button", { name: "다음 문제" }));
    expect(screen.getByText("문제 2")).toBeOnTheScreen();
  });

  it("마지막 문제를 틀려도 해설을 보여주고, 결과 보기를 눌러야 결과로 간다", async () => {
    mockQuizzes.mockReturnValue({
      data: quizSet({ nextQuizOrder: 2 }),
      isPending: false,
    });
    grade(3, "정답은 다예요");
    const answer = mockAnswer.getMockImplementation()!;
    mockAnswer.mockImplementation((body, options) => {
      // 마지막 답 뒤에는 다 풀어 nextQuizOrder가 null이 된다
      mockQuizzes.mockReturnValue({
        data: quizSet({ nextQuizOrder: null }),
        isPending: false,
      });
      answer(body, options);
    });
    const user = userEvent.setup();
    await render(<QuizScreen />);
    await user.press(screen.getByText("2-가"));
    expect(screen.getByText("정답은 다예요")).toBeOnTheScreen();
    expect(router.replace).not.toHaveBeenCalled();
    await user.press(screen.getByRole("button", { name: "결과 보기" }));
    expect(router.replace).toHaveBeenCalledWith("/quiz/result");
  });

  it("이미 다 풀었으면 1번부터 고른 답 · 해설을 다시 보여주고, 마지막 뒤에 결과로 간다", async () => {
    mockQuizzes.mockReturnValue({
      data: quizSet({
        nextQuizOrder: null,
        quizzes: [
          // 1번 오답(가 선택, 정답 다), 2번 정답(나)
          {
            ...quiz(1),
            answered: true,
            selectedSeq: 1,
            answerSeq: 3,
            correct: false,
            explanation: "정답은 1-다예요",
          },
          {
            ...quiz(2),
            answered: true,
            selectedSeq: 2,
            answerSeq: 2,
            correct: true,
            explanation: "정답 해설",
          },
        ],
        progress: {
          total: 2,
          answeredCount: 2,
          correctCount: 1,
          finished: true,
        },
      }),
      isPending: false,
    });
    const user = userEvent.setup();
    await render(<QuizScreen />);

    expect(router.replace).not.toHaveBeenCalled();
    expect(screen.getByText("문제 1")).toBeOnTheScreen();
    expect(screen.getByText("정답은 1-다예요")).toBeOnTheScreen();
    // 다시 보기에서는 답을 바꿀 수 없다
    await user.press(screen.getByText("1-나"));
    expect(mockAnswer).not.toHaveBeenCalled();

    await user.press(screen.getByRole("button", { name: "다음 문제" }));
    expect(screen.getByText("문제 2")).toBeOnTheScreen();
    // 맞힌 문제도 해설을 보여준다
    expect(screen.getByText("정답이에요!")).toBeOnTheScreen();
    expect(screen.getByText("정답 해설")).toBeOnTheScreen();

    await user.press(screen.getByRole("button", { name: "결과 보기" }));
    expect(router.replace).toHaveBeenCalledWith("/quiz/result");
  });

  it("낼 문제가 없으면 결과 화면으로 보낸다", async () => {
    mockQuizzes.mockReturnValue({
      data: quizSet({
        nextQuizOrder: null,
        quizzes: [],
        progress: {
          total: 0,
          answeredCount: 0,
          correctCount: 0,
          finished: true,
        },
      }),
      isPending: false,
    });
    await render(<QuizScreen />);
    expect(router.replace).toHaveBeenCalledWith("/quiz/result");
  });

  it("오늘 노선이 없으면 퀴즈를 요청하지 않고 풀 퀴즈가 없다고 알린다", async () => {
    mockRoute.mockReturnValue({
      data: { state: "NONE", route: null },
      isPending: false,
    });
    mockQuizzes.mockReturnValue({ data: undefined, isPending: true });
    await render(<QuizScreen />);
    expect(mockQuizzes).toHaveBeenCalledWith(undefined);
    expect(
      screen.getByText("지금은 풀 수 있는 퀴즈가 없어요"),
    ).toBeOnTheScreen();
  });
});
