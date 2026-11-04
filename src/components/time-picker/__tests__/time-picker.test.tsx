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

  it("첫 항목에서 내리면 onChange를 호출하지 않는다", async () => {
    const onChange = await renderPicker({ hour: 8, minute: 0 });
    await act("분", "decrement");
    expect(onChange).not.toHaveBeenCalled();
  });
});
