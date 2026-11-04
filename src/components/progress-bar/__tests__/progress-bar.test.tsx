import { render, screen } from "@testing-library/react-native";

import { ProgressBar } from "../progress-bar";

describe("ProgressBar", () => {
  it("진행률을 퍼센트로 알린다", async () => {
    await render(<ProgressBar progress={0.83} />);
    expect(screen.getByRole("progressbar")).toHaveAccessibilityValue({
      now: 83,
    });
  });

  it("0~1 범위를 벗어난 값은 끝값으로 자른다", async () => {
    await render(<ProgressBar progress={1.5} />);
    expect(screen.getByRole("progressbar")).toHaveAccessibilityValue({
      now: 100,
    });
  });
});
