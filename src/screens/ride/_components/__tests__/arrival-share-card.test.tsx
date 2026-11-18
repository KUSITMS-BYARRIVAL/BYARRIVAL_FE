import { render, screen } from "@testing-library/react-native";

import { ArrivalShareCard } from "../arrival-share-card";

describe("ArrivalShareCard", () => {
  it("완주 문구와 읽은 기사 수 · 연속 이용 일수를 보여준다", async () => {
    await render(<ArrivalShareCard readCount={7} streakDays={3} />);
    expect(screen.getByText("오늘도 해냈다!")).toBeOnTheScreen();
    expect(screen.getByText("7개")).toBeOnTheScreen();
    expect(screen.getByText("3일째")).toBeOnTheScreen();
  });
});
