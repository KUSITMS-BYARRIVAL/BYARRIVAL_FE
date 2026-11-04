import { render, screen } from "@testing-library/react-native";

import { SummaryCard } from "../summary-card";

describe("SummaryCard", () => {
  it("요약 항목마다 1부터 번호를 붙인다", async () => {
    await render(<SummaryCard points={["첫째", "둘째", "셋째"]} />);
    expect(screen.getByText("3")).toBeOnTheScreen();
    expect(screen.getByText("셋째")).toBeOnTheScreen();
  });

  it("같은 문구가 반복돼도 모두 보여준다", async () => {
    await render(<SummaryCard points={["같은 요약", "같은 요약"]} />);
    expect(screen.getAllByText("같은 요약")).toHaveLength(2);
  });
});
