import { render, screen } from "@testing-library/react-native";

import { CommuterCountCard } from "../commuter-count-card";

describe("CommuterCountCard", () => {
  it("인원 수를 천 단위 쉼표로 보여준다", async () => {
    await render(<CommuterCountCard count={1284} />);
    expect(screen.getByText("1,284명")).toBeOnTheScreen();
  });
});
