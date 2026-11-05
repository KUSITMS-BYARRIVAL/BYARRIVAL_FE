import { fireEvent, render, screen } from "@testing-library/react-native";

import { CalendarHeader } from "../calendar-header";

describe("CalendarHeader", () => {
  it("제목을 표시한다", async () => {
    await render(
      <CalendarHeader
        title="2026년 9월"
        prevLabel="이전 달"
        nextLabel="다음 달"
        onPrev={jest.fn()}
        onNext={jest.fn()}
      />,
    );
    expect(screen.getByText("2026년 9월")).toBeOnTheScreen();
  });

  it("화살표를 누르면 이전 / 다음 콜백을 호출한다", async () => {
    const onPrev = jest.fn();
    const onNext = jest.fn();
    await render(
      <CalendarHeader
        title="2026년 9월"
        prevLabel="이전 달"
        nextLabel="다음 달"
        onPrev={onPrev}
        onNext={onNext}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "이전 달" }));
    expect(onPrev).toHaveBeenCalledTimes(1);

    await fireEvent.press(screen.getByRole("button", { name: "다음 달" }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
