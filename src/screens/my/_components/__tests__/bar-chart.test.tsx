import { render, screen } from "@testing-library/react-native";

import { BarChart } from "../bar-chart";

describe("BarChart", () => {
  it("주마다 읽은 시간을 표시하고 처음은 n주 전, 끝은 이번주로 표시한다", async () => {
    await render(<BarChart weeklyMinutes={[10, 10, 50, 118]} />);

    expect(screen.getAllByText("10")).toHaveLength(2);
    expect(screen.getByText("50")).toBeOnTheScreen();
    expect(screen.getByText("118")).toBeOnTheScreen();
    expect(screen.getByText("4주 전")).toBeOnTheScreen();
    expect(screen.getByText("이번주")).toBeOnTheScreen();
  });

  it("한 주만 있으면 이번주 라벨만 표시한다", async () => {
    await render(<BarChart weeklyMinutes={[30]} />);

    expect(screen.getByText("이번주")).toBeOnTheScreen();
    expect(screen.queryByText(/주 전/)).toBeNull();
  });

  it("0분인 주도 숫자 0을 표시한다", async () => {
    await render(<BarChart weeklyMinutes={[0, 20]} />);

    expect(screen.getByText("0")).toBeOnTheScreen();
  });
});
