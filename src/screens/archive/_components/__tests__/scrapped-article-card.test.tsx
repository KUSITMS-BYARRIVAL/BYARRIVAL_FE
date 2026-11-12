import {
  render,
  screen,
  userEvent,
  within,
} from "@testing-library/react-native";

import { ScrappedArticleCard } from "../scrapped-article-card";

const ARTICLE = {
  category: "economy" as const,
  categoryLabel: "경제",
  title: "한국은행, 기준금리 동결",
  image: "https://example.com/a.png",
  aiSummary: "엑시노스 2600, Apple NPU의 85% 성능 달성",
  isBookmarked: true,
};

describe("ScrappedArticleCard", () => {
  it("제목·AI 요약을 보여주고, 카드를 누르면 onPress, 북마크를 누르면 onBookmarkPress만 호출한다", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    const onBookmarkPress = jest.fn();
    await render(
      <ScrappedArticleCard
        {...ARTICLE}
        onPress={onPress}
        onBookmarkPress={onBookmarkPress}
      />,
    );
    expect(screen.getByText(ARTICLE.aiSummary)).toBeOnTheScreen();
    await user.press(screen.getByText(ARTICLE.title));
    expect(onPress).toHaveBeenCalledTimes(1);
    await user.press(screen.getByRole("button", { name: "북마크" }));
    expect(onBookmarkPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("원문이 삭제된 기사는 안내 문구를 보여주고, 눌러도 열리지 않지만 북마크로 삭제할 수 있다", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    const onBookmarkPress = jest.fn();
    await render(
      <ScrappedArticleCard
        {...ARTICLE}
        isDeleted
        onPress={onPress}
        onBookmarkPress={onBookmarkPress}
      />,
    );
    expect(screen.getByText("삭제된 기사예요")).toBeOnTheScreen();
    expect(screen.queryByText(ARTICLE.aiSummary)).not.toBeOnTheScreen();
    await user.press(screen.getByText(ARTICLE.title));
    expect(onPress).not.toHaveBeenCalled();
    await user.press(screen.getByRole("button", { name: "북마크" }));
    expect(onBookmarkPress).toHaveBeenCalledTimes(1);
  });

  it("북마크는 카드 버튼 밖에 있어 스크린리더가 카드와 따로 읽는다", async () => {
    await render(<ScrappedArticleCard {...ARTICLE} />);
    const card = screen.getByRole("button", { name: /한국은행/ });
    expect(within(card).queryByRole("button", { name: "북마크" })).toBeNull();
    expect(screen.getByRole("button", { name: "북마크" })).toBeOnTheScreen();
  });
});
