import { render, screen } from "@testing-library/react-native";

import { EditorPickSmalltalkCard } from "../editor-pick-smalltalk-card";

describe("EditorPickSmalltalkCard", () => {
  it("뉴스 제목은 한 줄로 자르고 카테고리를 붙여 보여준다", async () => {
    await render(
      <EditorPickSmalltalkCard
        category="economy"
        categoryLabel="경제"
        newsTitle="한국은행, 기준금리 동결"
        question="대출 있으세요?"
        followUp="하반기 인하 가능성이 60%래요."
        isBookmarked
        onBookmarkPress={jest.fn()}
      />,
    );
    expect(screen.getByText("오늘의 뉴스ㆍ경제")).toBeOnTheScreen();
    expect(
      screen.getByText("한국은행, 기준금리 동결").props.numberOfLines,
    ).toBe(1);
    expect(screen.getByText("대출 있으세요?")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "북마크" })).toBeSelected();
  });
});
