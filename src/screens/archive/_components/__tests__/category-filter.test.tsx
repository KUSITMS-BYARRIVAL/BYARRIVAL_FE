import { render, screen, userEvent } from "@testing-library/react-native";

import { CategoryFilter } from "../category-filter";

const CHIPS = [
  { value: "economy" as const, label: "경제" },
  { value: "tech" as const, label: "테크" },
];

describe("CategoryFilter", () => {
  it("'전체'를 맨 앞에 두고 받은 칩을 순서대로 보여주며, 고른 칩만 선택 상태다", async () => {
    await render(
      <CategoryFilter chips={CHIPS} value="tech" onChange={jest.fn()} />,
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    expect(screen.getByRole("button", { name: "전체" })).not.toBeSelected();
    expect(screen.getByRole("button", { name: "경제" })).not.toBeSelected();
    expect(screen.getByRole("button", { name: "테크" })).toBeSelected();
  });

  it("칩을 누르면 그 카테고리 값으로 onChange를 호출한다", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    await render(
      <CategoryFilter chips={CHIPS} value="all" onChange={onChange} />,
    );
    await user.press(screen.getByRole("button", { name: "경제" }));
    expect(onChange).toHaveBeenLastCalledWith("economy");
    await user.press(screen.getByRole("button", { name: "전체" }));
    expect(onChange).toHaveBeenLastCalledWith("all");
  });
});
