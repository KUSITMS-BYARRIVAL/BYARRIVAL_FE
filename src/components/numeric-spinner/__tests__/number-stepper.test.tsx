import {
  fireEvent,
  render,
  screen,
  userEvent,
} from "@testing-library/react-native";

import { NumberStepper } from "../number-stepper";

async function renderStepper(value: number) {
  const onChange = jest.fn();
  await render(
    <NumberStepper
      value={value}
      onChange={onChange}
      min={0}
      max={60}
      step={10}
      accessibilityLabel="월"
    />,
  );
  return onChange;
}

const button = (name: string) => screen.getByRole("button", { name });

describe("NumberStepper", () => {
  it("현재 값을 보여주고 늘리기·줄이기를 누르면 step만큼 바꾼다", async () => {
    const user = userEvent.setup();
    const onChange = await renderStepper(30);
    expect(screen.getByText("30")).toBeOnTheScreen();
    await user.press(button("늘리기"));
    expect(onChange).toHaveBeenLastCalledWith(40);
    await user.press(button("줄이기"));
    expect(onChange).toHaveBeenLastCalledWith(20);
  });

  it("최솟값이면 줄이기 버튼이 비활성화된다", async () => {
    await renderStepper(0);
    expect(button("줄이기")).toBeDisabled();
    expect(button("늘리기")).toBeEnabled();
  });

  it("최댓값이면 늘리기 버튼이 비활성화된다", async () => {
    await renderStepper(60);
    expect(button("늘리기")).toBeDisabled();
  });

  it("스크린리더 조절 동작으로 값을 바꾼다", async () => {
    const onChange = await renderStepper(30);
    const stepper = screen.getByRole("adjustable", { name: "월" });
    expect(stepper).toHaveAccessibilityValue({ text: "30" });
    // 조절 동작은 userEvent로 낼 수 없어 이벤트를 직접 보낸다
    await fireEvent(stepper, "accessibilityAction", {
      nativeEvent: { actionName: "increment" },
    });
    expect(onChange).toHaveBeenCalledWith(40);
  });
});
