import { fireEvent, render, screen } from "@testing-library/react-native";

import { Calendar } from "../calendar";

const renderCalendar = (props: Partial<Parameters<typeof Calendar>[0]> = {}) =>
  render(
    <Calendar
      year={2026}
      month={9}
      onPrevMonth={jest.fn()}
      onNextMonth={jest.fn()}
      {...props}
    />,
  );

describe("Calendar", () => {
  it("연·월 제목을 표시한다", async () => {
    await renderCalendar();
    expect(screen.getByText("2026년 9월")).toBeOnTheScreen();
  });

  it("그 달의 마지막 날까지만 날짜를 표시한다", async () => {
    await renderCalendar();
    expect(screen.getByText("30")).toBeOnTheScreen();
    expect(screen.queryByText("31")).not.toBeOnTheScreen();
  });

  it("화살표를 누르면 이전 달 / 다음 달 콜백을 호출한다", async () => {
    const onPrevMonth = jest.fn();
    const onNextMonth = jest.fn();
    await renderCalendar({ onPrevMonth, onNextMonth });

    await fireEvent.press(screen.getByRole("button", { name: "이전 달" }));
    expect(onPrevMonth).toHaveBeenCalledTimes(1);

    await fireEvent.press(screen.getByRole("button", { name: "다음 달" }));
    expect(onNextMonth).toHaveBeenCalledTimes(1);
  });
});
