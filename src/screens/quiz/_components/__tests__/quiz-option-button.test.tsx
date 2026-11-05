import { render, screen, userEvent } from "@testing-library/react-native";

import { QuizOptionButton } from "../quiz-option-button";

describe("QuizOptionButton", () => {
  it("번호와 보기를 보여주고 누르면 onPress를 호출한다", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(
      <QuizOptionButton number={1} label="기준금리 동결" onPress={onPress} />,
    );
    await user.press(screen.getByRole("button", { name: "1 기준금리 동결" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["correct", "정답"],
    ["incorrect", "오답"],
  ] as const)("%s 상태를 스크린리더에 '%s'로 알린다", async (state, text) => {
    await render(<QuizOptionButton number={2} label="보기" state={state} />);
    expect(screen.getByRole("button")).toHaveAccessibilityValue({ text });
  });

  it("채점 전·흐린 상태는 결과를 알리지 않는다", async () => {
    await render(<QuizOptionButton number={3} label="보기" state="dimmed" />);
    expect(screen.getByRole("button")).not.toHaveAccessibilityValue({
      text: "오답",
    });
  });
});
