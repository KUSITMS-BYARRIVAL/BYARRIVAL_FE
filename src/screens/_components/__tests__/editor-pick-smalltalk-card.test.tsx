import {
  render,
  screen,
  userEvent,
  within,
} from "@testing-library/react-native";

import { EditorPickSmalltalkCard } from "../editor-pick-smalltalk-card";

const SMALLTALK = {
  category: "economy" as const,
  categoryLabel: "경제",
  newsTitle: "한국은행, 기준금리 동결",
  question: "대출 있으세요?",
  isBookmarked: true,
  onBookmarkPress: jest.fn(),
};

describe("EditorPickSmalltalkCard", () => {
  it("뉴스 제목은 한 줄로 자르고 카테고리를 붙여 보여준다", async () => {
    await render(<EditorPickSmalltalkCard {...SMALLTALK} />);
    expect(screen.getByText("오늘의 뉴스ㆍ경제")).toBeOnTheScreen();
    expect(screen.getByText(SMALLTALK.newsTitle).props.numberOfLines).toBe(1);
    expect(screen.getByText(SMALLTALK.question)).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "북마크" })).toBeSelected();
  });

  it("카드를 누르면 onPress, 북마크를 누르면 onBookmarkPress만 호출한다", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    const onBookmarkPress = jest.fn();
    await render(
      <EditorPickSmalltalkCard
        {...SMALLTALK}
        onPress={onPress}
        onBookmarkPress={onBookmarkPress}
      />,
    );
    await user.press(screen.getByText(SMALLTALK.question));
    expect(onPress).toHaveBeenCalledTimes(1);
    await user.press(screen.getByRole("button", { name: "북마크" }));
    expect(onBookmarkPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("원문이 삭제된 뉴스는 제목 대신 안내 문구를 보여주고, 눌러도 열리지 않지만 북마크로 삭제할 수 있다", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    const onBookmarkPress = jest.fn();
    await render(
      <EditorPickSmalltalkCard
        {...SMALLTALK}
        isDeleted
        onPress={onPress}
        onBookmarkPress={onBookmarkPress}
      />,
    );
    expect(screen.getByText("삭제된 기사예요")).toBeOnTheScreen();
    expect(screen.queryByText(SMALLTALK.newsTitle)).not.toBeOnTheScreen();
    await user.press(screen.getByText(SMALLTALK.question));
    expect(onPress).not.toHaveBeenCalled();
    await user.press(screen.getByRole("button", { name: "북마크" }));
    expect(onBookmarkPress).toHaveBeenCalledTimes(1);
  });

  it("북마크는 카드 버튼 밖에 있어 스크린리더가 카드와 따로 읽는다", async () => {
    await render(<EditorPickSmalltalkCard {...SMALLTALK} />);
    const card = screen.getByRole("button", { name: /한국은행/ });
    expect(within(card).queryByRole("button", { name: "북마크" })).toBeNull();
    expect(screen.getByRole("button", { name: "북마크" })).toBeOnTheScreen();
  });
});
