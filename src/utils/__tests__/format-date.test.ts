import { formatDotDate, formatMonthDayWeekday } from "../format-date";

describe("formatMonthDayWeekday", () => {
  it("월 · 일 · 요일을 한국어로 만든다", () => {
    expect(formatMonthDayWeekday(new Date(2026, 9, 10))).toBe(
      "10월 10일 토요일",
    );
  });

  it("일요일과 한 자리 월 · 일도 그대로 쓴다", () => {
    expect(formatMonthDayWeekday(new Date(2026, 0, 4))).toBe("1월 4일 일요일");
  });
});

describe("formatDotDate", () => {
  it("연 · 월 · 일을 점으로 잇고 한 자리 월 · 일은 0을 붙인다", () => {
    expect(formatDotDate(new Date(2026, 0, 4))).toBe("2026.01.04");
  });

  it("두 자리 월 · 일은 그대로 쓴다", () => {
    expect(formatDotDate(new Date(2026, 10, 18))).toBe("2026.11.18");
  });
});
