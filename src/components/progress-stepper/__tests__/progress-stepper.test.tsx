import { fireEvent, render, screen } from "@testing-library/react-native";

import { ProgressStepper } from "../progress-stepper";
import { ProgressStepperSmall } from "../progress-stepper-small";

// 너비 353 → 점 중심이 21 ~ 332를 6칸으로 나눈다
async function renderStepper(current: number, total = 7) {
  await render(<ProgressStepper total={total} current={current} showVehicle />);
  const bar = screen.getByRole("progressbar");
  await fireEvent(bar, "layout", { nativeEvent: { layout: { width: 353 } } });
  return bar;
}

type Node = ReturnType<typeof screen.getByRole>;
// 자식은 모두 View라 문자열 노드가 없다
const child = (node: Node, i: number) => node.children[i] as Node;
const fill = (bar: Node) => child(child(bar, 0), 0);

describe("ProgressStepper", () => {
  it("현재 단계를 progressbar 값으로 알린다", async () => {
    const bar = await renderStepper(3);
    expect(bar).toHaveAccessibilityValue({ min: 1, max: 7, now: 3 });
  });

  it("채움은 현재 점의 오른쪽 끝까지 그린다", async () => {
    const bar = await renderStepper(1);
    expect(fill(bar)).toHaveStyle({ width: 28 });
  });

  it("마지막 단계면 트랙 끝까지 채운다", async () => {
    const bar = await renderStepper(7);
    expect(fill(bar)).toHaveStyle({ width: 353 });
  });

  it("범위 밖 단계는 끝값으로 자른다", async () => {
    const bar = await renderStepper(10, 3);
    expect(bar).toHaveAccessibilityValue({ now: 3 });
  });
});

describe("ProgressStepperSmall", () => {
  it("brand 톤은 현재 단계까지 채운 점으로 표시한다", async () => {
    await render(<ProgressStepperSmall tone="brand" current={2} />);
    const dots = child(screen.getByRole("progressbar"), 0).children as Node[];
    expect(dots).toHaveLength(7);
    expect(dots[1]!.props.className).toContain("bg-green-500");
    expect(dots[2]!.props.className).toContain("bg-green-100");
  });
});
