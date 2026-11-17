import { render, screen, userEvent } from "@testing-library/react-native";

import { CategoryFilter } from "../category-filter";

const CHIPS = [
  { categoryId: 4, name: "경제·금융" },
  { categoryId: 6, name: "IT·기술" },
];

describe("CategoryFilter", () => {
  it("'전체'를 맨 앞에 두고 받은 칩을 순서대로 보여주며, 고른 칩만 선택 상태다", async () => {
    await render(
      <CategoryFilter chips={CHIPS} value={6} onChange={jest.fn()} />,
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    expect(screen.getByRole("button", { name: "전체" })).not.toBeSelected();
    expect(
      screen.getByRole("button", { name: "경제·금융" }),
    ).not.toBeSelected();
    expect(screen.getByRole("button", { name: "IT·기술" })).toBeSelected();
  });

  it("칩을 누르면 그 카테고리 id로 onChange를 호출한다", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    await render(
      <CategoryFilter chips={CHIPS} value="all" onChange={onChange} />,
    );
    await user.press(screen.getByRole("button", { name: "경제·금융" }));
    expect(onChange).toHaveBeenLastCalledWith(4);
    await user.press(screen.getByRole("button", { name: "전체" }));
    expect(onChange).toHaveBeenLastCalledWith("all");
  });
});
