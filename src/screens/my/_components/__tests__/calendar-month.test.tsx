import { render, screen } from "@testing-library/react-native";

import { CalendarMonth } from "../calendar-month";

const renderCalendarMonth = () =>
  render(
    <CalendarMonth
      year={2026}
      month={9}
      onPrevMonth={jest.fn()}
      onNextMonth={jest.fn()}
    />,
  );

describe("CalendarMonth", () => {
  it("연·월 제목을 표시한다", async () => {
    await renderCalendarMonth();
    expect(screen.getByText("2026년 9월")).toBeOnTheScreen();
  });

  it("그 달의 마지막 날까지만 날짜를 표시한다", async () => {
    await renderCalendarMonth();
    expect(screen.getByText("30")).toBeOnTheScreen();
    expect(screen.queryByText("31")).not.toBeOnTheScreen();
  });
});
