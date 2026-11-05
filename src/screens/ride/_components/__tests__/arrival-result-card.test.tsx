import { render, screen } from "@testing-library/react-native";

import { ArrivalResultCard } from "../arrival-result-card";

describe("ArrivalResultCard", () => {
  it("읽은 기사 수와 연속 이용 일수를 보여준다", async () => {
    await render(<ArrivalResultCard readCount={3} total={7} streakDays={5} />);
    expect(screen.getByText("3개")).toBeOnTheScreen();
    expect(screen.getByText("5일째")).toBeOnTheScreen();
  });

  it("모든 기사의 원문을 열었으면 '모두 완독' 배지를 보여준다", async () => {
    await render(<ArrivalResultCard readCount={7} total={7} streakDays={1} />);
    expect(screen.getByText("모두 완독")).toBeOnTheScreen();
  });

  it("일부만 열었으면 '부분 완독' 배지를 보여준다", async () => {
    await render(<ArrivalResultCard readCount={1} total={7} streakDays={1} />);
    expect(screen.getByText("부분 완독")).toBeOnTheScreen();
  });

  it("하나도 열지 않았으면 배지를 숨긴다", async () => {
    await render(<ArrivalResultCard readCount={0} total={7} streakDays={1} />);
    expect(screen.getByText("0개")).toBeOnTheScreen();
    expect(screen.queryByText(/완독/)).toBeNull();
  });
});
