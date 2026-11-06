import { render, screen, userEvent } from "@testing-library/react-native";

import { NewsCard } from "../news-card";

describe("NewsCard", () => {
  it("읽는 시간과 제목을 보여준다", async () => {
    await render(
      <NewsCard
        category="economy"
        categoryLabel="경제"
        readMinutes={2}
        title="한국은행, 기준금리 동결"
        image="https://example.com/a.png"
      />,
    );
    expect(screen.getByText("2분")).toBeOnTheScreen();
    expect(screen.getByText("한국은행, 기준금리 동결")).toBeOnTheScreen();
  });
});

describe("NewsCard 선택", () => {
  it("누르면 onPress를 부르고, 선택 상태를 알린다", async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await render(
      <NewsCard
        category="economy"
        categoryLabel="경제"
        readMinutes={2}
        title="한국은행, 기준금리 동결"
        image="https://example.com/a.png"
        isSelected
        onPress={onPress}
      />,
    );
    const card = screen.getByRole("checkbox");
    expect(card).toBeChecked();
    await user.press(card);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
