import { getCalendarWeeks } from "../helpers";

describe("getCalendarWeeks", () => {
  it("월요일 시작으로 1일 앞을 빈칸으로 채운다", () => {
    // 2026-09-01은 화요일
    expect(getCalendarWeeks(2026, 9)[0]).toEqual([null, 1, 2, 3, 4, 5, 6]);
  });

  it("일요일에 시작하는 달은 앞 빈칸이 6개다", () => {
    // 2026-02-01은 일요일
    expect(getCalendarWeeks(2026, 2)[0]).toEqual([
      null,
      null,
      null,
      null,
      null,
      null,
      1,
    ]);
  });

  it("마지막 주 뒤를 빈칸으로 채워 모든 주가 7칸이다", () => {
    const weeks = getCalendarWeeks(2026, 9);
    expect(weeks).toHaveLength(5);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(weeks[4]).toEqual([28, 29, 30, null, null, null, null]);
  });
});
