import { fireEvent, render, screen } from "@testing-library/react-native";

import { RecordCalendar } from "../record-calendar";

const DAY_STATUSES = {
  "2026-11": { 5: "attendance", 6: "complete" },
  "2026-10": { 6: "offday" },
} as const;
const MONTH_STATUSES = { 2026: { 3: "complete" } } as const;

const renderCalendar = (
  props: Partial<React.ComponentProps<typeof RecordCalendar>> = {},
) =>
  render(
    <RecordCalendar
      dayStatusesByMonth={DAY_STATUSES}
      monthStatusesByYear={MONTH_STATUSES}
      {...props}
    />,
  );

describe("RecordCalendar", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 10, 6, 12));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("기본으로 이번 달 제목을 표시한다", async () => {
    await renderCalendar();
    expect(screen.getByText("2026년 11월")).toBeOnTheScreen();
  });

  it("이번 달에서는 오늘 날짜만 현재로 표시한다", async () => {
    await renderCalendar();
    expect(screen.getByLabelText("6, 완주, 현재")).toBeOnTheScreen();
    expect(screen.getAllByLabelText(/현재/)).toHaveLength(1);
  });

  it("이전 달로 이동하면 오늘 표시가 사라진다", async () => {
    await renderCalendar();
    await fireEvent.press(screen.getByLabelText("이전 달"));
    expect(screen.getByText("2026년 10월")).toBeOnTheScreen();
    expect(screen.queryByLabelText(/현재/)).not.toBeOnTheScreen();
  });

  it("1월에서 이전 달로 가면 전년 12월이 된다", async () => {
    await renderCalendar();
    for (let i = 0; i < 10; i++) {
      await fireEvent.press(screen.getByLabelText("이전 달"));
    }
    expect(screen.getByText("2026년 1월")).toBeOnTheScreen();
    await fireEvent.press(screen.getByLabelText("이전 달"));
    expect(screen.getByText("2025년 12월")).toBeOnTheScreen();
  });

  it("12월에서 다음 달로 가면 다음 해 1월이 된다", async () => {
    await renderCalendar();
    await fireEvent.press(screen.getByLabelText("다음 달"));
    expect(screen.getByText("2026년 12월")).toBeOnTheScreen();
    await fireEvent.press(screen.getByLabelText("다음 달"));
    expect(screen.getByText("2027년 1월")).toBeOnTheScreen();
  });

  it("보는 달의 연-월 키로 상태를 찾는다", async () => {
    await renderCalendar();
    expect(screen.getByLabelText("5, 출석")).toBeOnTheScreen();
    await fireEvent.press(screen.getByLabelText("이전 달"));
    expect(screen.getByLabelText("6, 쉬는 날")).toBeOnTheScreen();
    expect(screen.queryByLabelText("5, 출석")).not.toBeOnTheScreen();
  });

  it("해당 달 데이터가 없으면 상태 없이 표시한다", async () => {
    await renderCalendar({ dayStatusesByMonth: {} });
    expect(screen.getByLabelText("6, 현재")).toBeOnTheScreen();
  });

  it("이번 년도 탭을 누르면 연도와 현재 월을 표시한다", async () => {
    await renderCalendar();
    await fireEvent.press(screen.getByText("이번 년도"));
    expect(screen.getByText("2026년")).toBeOnTheScreen();
    expect(screen.getByLabelText(/11월.*현재/)).toBeOnTheScreen();
  });

  it("연도 탭에서 이전 해로 가면 현재 표시가 사라진다", async () => {
    await renderCalendar();
    await fireEvent.press(screen.getByText("이번 년도"));
    await fireEvent.press(screen.getByLabelText("이전 해"));
    expect(screen.getByText("2025년")).toBeOnTheScreen();
    expect(screen.queryByLabelText(/현재/)).not.toBeOnTheScreen();
  });

  it("연도 탭에서 해당 연도의 월 상태를 표시한다", async () => {
    await renderCalendar();
    await fireEvent.press(screen.getByText("이번 년도"));
    expect(screen.getByLabelText("3월, 완주")).toBeOnTheScreen();
  });
});
