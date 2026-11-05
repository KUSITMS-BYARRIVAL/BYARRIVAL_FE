import { fireEvent, render, screen } from "@testing-library/react-native";

import { CalendarYear } from "../calendar-year";

describe("CalendarYear", () => {
  it("연도 제목과 1월부터 12월까지 표시한다", async () => {
    await render(
      <CalendarYear
        year={2026}
        onPrevYear={jest.fn()}
        onNextYear={jest.fn()}
      />,
    );
    expect(screen.getByText("2026년")).toBeOnTheScreen();
    for (let month = 1; month <= 12; month++) {
      expect(screen.getByText(`${month}월`)).toBeOnTheScreen();
    }
  });

  it("화살표를 누르면 이전 해 / 다음 해 콜백을 호출한다", async () => {
    const onPrevYear = jest.fn();
    const onNextYear = jest.fn();
    await render(
      <CalendarYear
        year={2026}
        onPrevYear={onPrevYear}
        onNextYear={onNextYear}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "이전 해" }));
    expect(onPrevYear).toHaveBeenCalledTimes(1);

    await fireEvent.press(screen.getByRole("button", { name: "다음 해" }));
    expect(onNextYear).toHaveBeenCalledTimes(1);
  });
});
