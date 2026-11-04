import { render, screen } from "@testing-library/react-native";

import { CategoryBadge } from "../category-badge";

describe("CategoryBadge", () => {
  it("category에 맞는 배경과 글자 색을 쓴다", async () => {
    await render(<CategoryBadge category="culture" label="문화" />);
    const label = screen.getByText("문화");
    expect(label.props.className).toContain("text-category-culture");
    expect(label.parent?.props.className).toContain("bg-category-culture");
  });

  it("className을 컨테이너에 병합한다", async () => {
    await render(
      <CategoryBadge category="economy" label="경제" className="mt-2" />,
    );
    expect(screen.getByText("경제").parent?.props.className).toContain("mt-2");
  });
});
