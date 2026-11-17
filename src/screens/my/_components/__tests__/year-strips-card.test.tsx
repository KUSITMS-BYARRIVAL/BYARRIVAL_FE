import { render, screen } from "@testing-library/react-native";

import { YearStripsCard } from "../year-strips-card";

const TODAY = new Date(2026, 2, 31);

describe("YearStripsCard", () => {
  it("전달받은 완주 일수를 표시한다", async () => {
    await render(
      <YearStripsCard
        today={TODAY}
        levels={{ "2026-01-01": "complete" }}
        completedDays={2}
      />,
    );
    expect(screen.getByText("올해 2일 완주했어요")).toBeOnTheScreen();
  });

  it("1월부터 이번 달까지만 월 라벨을 표시한다", async () => {
    await render(
      <YearStripsCard today={TODAY} levels={{}} completedDays={0} />,
    );
    expect(screen.getByText("1월")).toBeOnTheScreen();
    expect(screen.getByText("3월")).toBeOnTheScreen();
    expect(screen.queryByText("4월")).not.toBeOnTheScreen();
  });
});
