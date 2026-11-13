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

  it("textClassName으로 기본 글자 타이포를 덮어쓴다", async () => {
    await render(<Bubble text="대출 있으세요?" textClassName="text-body2-m" />);
    const { className } = screen.getByText("대출 있으세요?").props;
    expect(className).toContain("text-body2-m");
    expect(className).not.toContain("text-body2-sb");
  });
});
