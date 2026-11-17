import { render, screen } from "@testing-library/react-native";

import { ArrivalResultCard } from "../arrival-result-card";

describe("ArrivalResultCard", () => {
  it("읽은 기사 수와 연속 이용 일수를 보여준다", async () => {
    await render(<ArrivalResultCard readCount={3} streakDays={5} />);
    expect(screen.getByText("3개")).toBeOnTheScreen();
    expect(screen.getByText("5일째")).toBeOnTheScreen();
  });

  it("완독 배지는 보여주지 않는다", async () => {
    await render(<ArrivalResultCard readCount={7} streakDays={1} />);
    expect(screen.queryByText(/완독/)).toBeNull();
  });

  it("하나도 읽지 않았으면 0개로 보여준다", async () => {
    await render(<ArrivalResultCard readCount={0} streakDays={1} />);
    expect(screen.getByText("0개")).toBeOnTheScreen();
  });
});
