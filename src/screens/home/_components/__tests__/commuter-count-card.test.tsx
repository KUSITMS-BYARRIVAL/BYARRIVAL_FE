import { render, screen } from "@testing-library/react-native";

import { CommuterCountCard } from "../commuter-count-card";

describe("CommuterCountCard", () => {
  it("인원 수를 천 단위 쉼표로 보여준다", async () => {
    await render(<CommuterCountCard count={1284} commute="출근" />);
    expect(screen.getByText("1,284명")).toBeOnTheScreen();
  });

  it("유형별 이동 이름을 라벨에 넣는다", async () => {
    await render(<CommuterCountCard count={1} commute="등교" />);
    expect(screen.getByText("지금 등교하는 사람")).toBeOnTheScreen();
  });
});
