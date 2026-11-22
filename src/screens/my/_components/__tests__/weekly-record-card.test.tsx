import { render, screen } from "@testing-library/react-native";

import { WeeklyRecordCard } from "../weekly-record-card";

describe("WeeklyRecordCard", () => {
  it("제목과 최근 N주 문구를 표시한다", async () => {
    await render(<WeeklyRecordCard weeklyMinutes={[10, 20, 30, 40]} />);
    expect(screen.getByText("쌓이는 기록")).toBeOnTheScreen();
    expect(screen.getByText("최근 4주동안 읽은 시간")).toBeOnTheScreen();
  });

  it("이번 주와 지난주의 차이를 분 단위로 표시한다", async () => {
    await render(<WeeklyRecordCard weeklyMinutes={[40, 100, 130]} />);
    expect(screen.getByText(/지난주보다 30분 더 읽었어요/)).toBeOnTheScreen();
  });

  it.each([[[100, 100]], [[100, 80]]])(
    "지난주보다 늘지 않았으면(%j) 문구를 숨긴다",
    async (weeklyMinutes) => {
      await render(<WeeklyRecordCard weeklyMinutes={weeklyMinutes} />);
      expect(screen.queryByText(/지난주보다/)).not.toBeOnTheScreen();
    },
  );

  it.each([[[0, 0, 0]], [[]]])(
    "기록이 없으면(%j) 그래프·비교 문구 대신 안내 문구를 표시한다",
    async (weeklyMinutes) => {
      await render(<WeeklyRecordCard weeklyMinutes={weeklyMinutes} />);
      expect(
        screen.getByText("뉴스를 읽어주세요. 기록이 쌓여요"),
      ).toBeOnTheScreen();
      expect(screen.queryByText(/지난주보다/)).not.toBeOnTheScreen();
    },
  );
});
