import { render, screen } from "@testing-library/react-native";

import { Bubble } from "../bubble";

describe("Bubble", () => {
  it("텍스트를 렌더한다", async () => {
    await render(<Bubble text="대출 있으세요?" />);
    expect(screen.getByText("대출 있으세요?")).toBeOnTheScreen();
  });

  it("버튼으로 안내하지 않는다", async () => {
    await render(<Bubble text="대출 있으세요?" />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
