import { fireEvent, render, screen } from "@testing-library/react-native";

import { RecentSavedArticlesCard } from "../recent-saved-articles-card";

const ARTICLES = [
  {
    id: "1",
    category: "economy" as const,
    label: "경제",
    title: '한국은행, 기준금리 동결... "하반기 불확실성 여전"',
  },
  {
    id: "2",
    category: "society" as const,
    label: "사회",
    title: "반도체 수출 3개월 연속 증가, 올해 최대",
  },
];

const renderCard = (
  props: Partial<React.ComponentProps<typeof RecentSavedArticlesCard>> = {},
) =>
  render(
    <RecentSavedArticlesCard
      articles={ARTICLES}
      onPressMore={jest.fn()}
      {...props}
    />,
  );

describe("RecentSavedArticlesCard", () => {
  it("기사마다 카테고리 라벨과 제목을 표시한다", async () => {
    await renderCard();
    expect(screen.getByText("경제")).toBeOnTheScreen();
    expect(screen.getByText(ARTICLES[0].title)).toBeOnTheScreen();
    expect(screen.getByText("사회")).toBeOnTheScreen();
    expect(screen.getByText(ARTICLES[1].title)).toBeOnTheScreen();
  });

  it("긴 제목은 한 줄로 자른다", async () => {
    await renderCard();
    expect(screen.getByText(ARTICLES[0].title).props.numberOfLines).toBe(1);
  });

  it("전체보기를 누르면 onPressMore를 호출한다", async () => {
    const onPressMore = jest.fn();
    await renderCard({ onPressMore });
    await fireEvent.press(screen.getByRole("button", { name: "전체보기" }));
    expect(onPressMore).toHaveBeenCalledTimes(1);
  });

  it("기사가 없으면 빈 상태 문구를 표시한다", async () => {
    await renderCard({ articles: [] });
    expect(screen.getByText("최근 저장한 기사가 없어요!")).toBeOnTheScreen();
    expect(screen.queryByText("경제")).not.toBeOnTheScreen();
  });
});
