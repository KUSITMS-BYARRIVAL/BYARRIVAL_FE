import { fireEvent, render, screen } from "@testing-library/react-native";

import { type Time, TimePicker } from "../time-picker";

async function renderPicker(value: Time) {
  const onChange = jest.fn();
  await render(<TimePicker value={value} onChange={onChange} />);
  return onChange;
}

const column = (name: string) => screen.getByRole("adjustable", { name });
const act = (name: string, actionName: "increment" | "decrement") =>
  fireEvent(column(name), "accessibilityAction", {
    nativeEvent: { actionName },
  });

type Node = ReturnType<typeof screen.getByRole>;
// 각 휠(adjustable)의 첫 자식이 스크롤 영역이다
const scrollView = (name: string) => column(name).children[0] as Node;

describe("TimePicker", () => {
  it("24시간 값을 12시간제 시·분·오전오후로 보여준다", async () => {
    await renderPicker({ hour: 20, minute: 5 });
    expect(column("시")).toHaveAccessibilityValue({ text: "8" });
    expect(column("분")).toHaveAccessibilityValue({ text: "05" });
    expect(column("오전 오후")).toHaveAccessibilityValue({ text: "오후" });
  });

  it("0시는 오전 12시로 보여준다", async () => {
    await renderPicker({ hour: 0, minute: 0 });
    expect(column("시")).toHaveAccessibilityValue({ text: "12" });
    expect(column("오전 오후")).toHaveAccessibilityValue({ text: "오전" });
  });

  it("분은 5분 단위로 맞춘다", async () => {
    await renderPicker({ hour: 8, minute: 58 });
    expect(column("분")).toHaveAccessibilityValue({ text: "55" });
  });

  it("시를 올리면 다음 시각으로 onChange를 호출한다", async () => {
    const onChange = await renderPicker({ hour: 8, minute: 0 });
    await act("시", "increment");
    expect(onChange).toHaveBeenCalledWith({ hour: 9, minute: 0 });
  });

  it("오전오후를 바꾸면 12시간을 더한다", async () => {
    const onChange = await renderPicker({ hour: 8, minute: 30 });
    await act("오전 오후", "increment");
    expect(onChange).toHaveBeenCalledWith({ hour: 20, minute: 30 });
  });

  it("오후 11시에서 시를 올리면 오후 12시(12시)가 된다", async () => {
    const onChange = await renderPicker({ hour: 23, minute: 0 });
    await act("시", "increment");
    expect(onChange).toHaveBeenCalledWith({ hour: 12, minute: 0 });
  });

  it("마지막 항목에서 올리면 onChange를 호출하지 않는다", async () => {
    const onChange = await renderPicker({ hour: 8, minute: 55 });
    await act("분", "increment");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("휠을 끌어서 멈추면 멈춘 칸의 값으로 onChange를 호출한다", async () => {
    const onChange = await renderPicker({ hour: 8, minute: 0 });
    const wheel = scrollView("분");
    await fireEvent(wheel, "scrollBeginDrag");
    // 한 칸 42px → 두 칸 아래(10분)에서 멈춤
    await fireEvent(wheel, "momentumScrollEnd", {
      nativeEvent: { contentOffset: { y: 84 } },
    });
    expect(onChange).toHaveBeenLastCalledWith({ hour: 8, minute: 10 });
  });

  it("끌지 않았는데 스크롤이 멈춘 이벤트만 오면 값을 바꾸지 않는다", async () => {
    const onChange = await renderPicker({ hour: 8, minute: 0 });
    await fireEvent(scrollView("분"), "momentumScrollEnd", {
      nativeEvent: { contentOffset: { y: 84 } },
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("첫 항목에서 내리면 onChange를 호출하지 않는다", async () => {
    const onChange = await renderPicker({ hour: 8, minute: 0 });
    await act("분", "decrement");
    expect(onChange).not.toHaveBeenCalled();
  });
});
