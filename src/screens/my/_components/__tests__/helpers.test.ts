import {
  getBarHeight,
  getCalendarWeeks,
  getYearStripColumns,
} from "../helpers";

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

describe("getBarHeight", () => {
  it("최댓값은 85px, 절반은 그 절반이다", () => {
    expect(getBarHeight(118, 118)).toBe(85);
    expect(getBarHeight(59, 118)).toBe(42.5);
  });

  it("0분이면 0px다", () => {
    expect(getBarHeight(0, 118)).toBe(0);
  });

  it("모든 주가 0분이어도 NaN 없이 0px다", () => {
    expect(getBarHeight(0, 0)).toBe(0);
  });
});

describe("getYearStripColumns", () => {
  it("1월 1일이 평일이면 첫 열의 그 앞 요일은 빈칸이다", () => {
    // 2026-01-01은 목요일
    expect(getYearStripColumns(new Date(2026, 10, 13))[0].days).toEqual([
      null,
      null,
      null,
      "2026-01-01",
      "2026-01-02",
    ]);
  });

  it("1월 1일이 주말이면 다음 주 월요일부터 시작한다", () => {
    // 2022-01-01은 토요일
    expect(getYearStripColumns(new Date(2022, 0, 5))).toEqual([
      {
        days: ["2022-01-03", "2022-01-04", "2022-01-05", null, null],
        monthLabel: 1,
      },
    ]);
  });

  it("오늘이 있는 주가 마지막 열이고 오늘 이후는 빈칸이다", () => {
    // 2026-11-11은 수요일
    expect(getYearStripColumns(new Date(2026, 10, 11)).at(-1)?.days).toEqual([
      "2026-11-09",
      "2026-11-10",
      "2026-11-11",
      null,
      null,
    ]);
  });

  it("새 달이 시작되는 열에만 월 라벨이 붙는다", () => {
    const columns = getYearStripColumns(new Date(2026, 2, 31));
    const labels = columns.flatMap(({ monthLabel }, i) =>
      monthLabel ? [[i, monthLabel]] : [],
    );
    // 2026-02-02, 03-02가 월요일이라 각각 5·9번째 열에서 시작한다
    expect(labels).toEqual([
      [0, 1],
      [5, 2],
      [9, 3],
    ]);
  });
});
