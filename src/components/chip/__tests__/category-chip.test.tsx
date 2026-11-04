import { fireEvent, render, screen } from "@testing-library/react-native";

import { CategoryChip } from "../category-chip";

const chip = () => screen.getByRole("button");

describe("CategoryChip", () => {
  it("미선택이면 카테고리 배경과 글자 색을 쓴다", async () => {
    await render(<CategoryChip category="tech" label="테크" />);
    expect(chip().props.className).toContain("bg-category-tech");
    expect(screen.getByText("테크").props.className).toContain(
      "text-category-tech",
    );
    expect(chip()).not.toBeSelected();
  });

  it("선택이면 진한 배경과 흰 글자를 쓰고 selected 상태가 된다", async () => {
    await render(<CategoryChip category="tech" label="테크" selected />);
    expect(chip().props.className).toContain("bg-ice-blue-600");
    expect(screen.getByText("테크").props.className).toContain(
      "text-on-fill-default",
    );
    expect(chip()).toBeSelected();
  });

  it("all은 btn neutral 계열 배경을 쓴다", async () => {
    await render(<CategoryChip category="all" label="전체" />);
    expect(chip().props.className).toContain("bg-btn-neutral-weak");
    expect(screen.getByText("전체").props.className).toContain("text-primary");
  });

  it("눌렀을 때 onPress를 호출한다", async () => {
    const onPress = jest.fn();
    await render(
      <CategoryChip category="all" label="전체" onPress={onPress} />,
    );
    await fireEvent.press(chip());
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
