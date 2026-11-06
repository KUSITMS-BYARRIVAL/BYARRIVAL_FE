import { render, screen } from "@testing-library/react-native";

import { WeeklyRecordCard } from "../weekly-record-card";

describe("WeeklyRecordCard", () => {
  it("제목과 최근 N주 문구를 표시한다", async () => {
    await render(
      <WeeklyRecordCard weeklyMinutes={[10, 20, 30, 40]} lastWeekDiff={10} />,
    );
    expect(screen.getByText("쌓이는 기록")).toBeOnTheScreen();
    expect(screen.getByText("최근 4주 읽은 시간")).toBeOnTheScreen();
  });

  it("전달받은 지난주 대비 차이를 분 단위로 표시한다", async () => {
    await render(
      <WeeklyRecordCard weeklyMinutes={[100, 150]} lastWeekDiff={30} />,
    );
    expect(screen.getByText(/지난주보다 30분 더 읽었어요/)).toBeOnTheScreen();
  });
});
