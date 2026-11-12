import { render, screen, userEvent } from "@testing-library/react-native";

import { EditorPickSection } from "../editor-pick-section";

const SMALLTALK = {
  category: "economy" as const,
  categoryLabel: "경제",
  newsTitle: "한국은행, 기준금리 동결",
  question: "기준금리 동결됐다는데 대출 있으세요?",
};

describe("EditorPickSection", () => {
  it("제목과 받은 스몰토크의 뉴스 제목·대화 문구를 보여준다", async () => {
    await render(
      <EditorPickSection smalltalk={SMALLTALK} onMorePress={jest.fn()} />,
    );
    expect(screen.getByText("스몰토크 추천")).toBeOnTheScreen();
    expect(screen.getByText(SMALLTALK.newsTitle)).toBeOnTheScreen();
    expect(screen.getByText(SMALLTALK.question)).toBeOnTheScreen();
  });

  it("홈 카드에는 북마크 버튼이 없다", async () => {
    await render(
      <EditorPickSection smalltalk={SMALLTALK} onMorePress={jest.fn()} />,
    );
    expect(
      screen.queryByRole("button", { name: "북마크" }),
    ).not.toBeOnTheScreen();
  });

  it("더보기를 누르면 onMorePress를 호출한다", async () => {
    const user = userEvent.setup();
    const onMorePress = jest.fn();
    await render(
      <EditorPickSection smalltalk={SMALLTALK} onMorePress={onMorePress} />,
    );
    await user.press(screen.getByRole("button", { name: "더보기" }));
    expect(onMorePress).toHaveBeenCalledTimes(1);
  });
});
