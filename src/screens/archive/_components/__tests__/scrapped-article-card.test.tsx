import { render, screen, userEvent } from "@testing-library/react-native";

import { ScrappedArticleCard } from "../scrapped-article-card";

describe("ScrappedArticleCard", () => {
  it("스크랩 시각·제목·AI 요약을 보여주고 북마크를 누르면 onBookmarkPress를 호출한다", async () => {
    const user = userEvent.setup();
    const onBookmarkPress = jest.fn();
    await render(
      <ScrappedArticleCard
        category="economy"
        categoryLabel="경제"
        scrappedAt="13:32"
        title="한국은행, 기준금리 동결"
        imageUrl="https://example.com/a.png"
        aiSummary="엑시노스 2600, Apple NPU의 85% 성능 달성"
        isBookmarked
        onBookmarkPress={onBookmarkPress}
      />,
    );
    expect(screen.getByText("13:32")).toBeOnTheScreen();
    expect(
      screen.getByText("엑시노스 2600, Apple NPU의 85% 성능 달성"),
    ).toBeOnTheScreen();
    await user.press(screen.getByRole("button", { name: "북마크" }));
    expect(onBookmarkPress).toHaveBeenCalledTimes(1);
  });
});
