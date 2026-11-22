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
// showVehicle이면 0번째가 지하철 아이콘, 1번째가 트랙이다
const fill = (bar: Node) => child(child(bar, 1), 0);

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

  it("지하철 아이콘은 트랙·점보다 먼저 그려 뒤 레이어에 둔다", async () => {
    const bar = await renderStepper(1);
    // 아이콘 박스 위치(Figma top -19)로 첫 자식이 아이콘인지 확인한다
    expect(child(bar, 0)).toHaveStyle({ top: -19 });
  });

  it("범위 밖 단계는 끝값으로 자른다", async () => {
    const bar = await renderStepper(10, 3);
    expect(bar).toHaveAccessibilityValue({ now: 3 });
  });
});

describe("ProgressStepperSmall", () => {
  it("전체 단계 수를 progressbar 값으로 알린다", async () => {
    await render(<ProgressStepperSmall total={5} />);
    expect(screen.getByRole("progressbar")).toHaveAccessibilityValue({
      min: 1,
      max: 5,
    });
  });
});
