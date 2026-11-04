import { fireEvent, render, screen } from "@testing-library/react-native";

import { CommuterCountCard } from "../commuter-count-card";
import { EditorPickSmalltalkCard } from "../editor-pick-smalltalk-card";
import { EditorPickTermCard } from "../editor-pick-term-card";
import { StreakCard } from "../streak-card";

describe("StreakCard", () => {
  it("닉네임·연속일·최장일을 보여주고 누르면 onPress를 호출한다", async () => {
    const onPress = jest.fn();
    await render(
      <StreakCard
        nickname="출근러"
        streakDays={7}
        longestDays={12}
        onPress={onPress}
      />,
    );
    expect(screen.getByText("출근러님과의 출근길")).toBeOnTheScreen();
    expect(screen.getByText("7")).toBeOnTheScreen();
    expect(screen.getByText("최장 12일")).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe("CommuterCountCard", () => {
  it("인원 수를 천 단위 쉼표로 보여준다", async () => {
    await render(<CommuterCountCard count={1284} />);
    expect(screen.getByText("1,284명")).toBeOnTheScreen();
  });
});

describe("EditorPickTermCard", () => {
  it("용어 내용을 보여주고 북마크를 누르면 onBookmarkPress를 호출한다", async () => {
    const onBookmarkPress = jest.fn();
    await render(
      <EditorPickTermCard
        category="economy"
        categoryLabel="경제"
        term="인플레이션"
        definition="물가가 계속 오르는 현상"
        example="예) 장바구니 물가가 부담돼요"
        editorComment="자주 나오는 경제 용어예요."
        bookmarked={false}
        onBookmarkPress={onBookmarkPress}
      />,
    );
    expect(screen.getByText("인플레이션")).toBeOnTheScreen();
    expect(
      screen.getByText("에디터 한마디 · 자주 나오는 경제 용어예요."),
    ).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "북마크" }));
    expect(onBookmarkPress).toHaveBeenCalledTimes(1);
  });
});

describe("EditorPickSmalltalkCard", () => {
  it("뉴스 제목은 한 줄로 자르고 카테고리를 붙여 보여준다", async () => {
    await render(
      <EditorPickSmalltalkCard
        category="economy"
        categoryLabel="경제"
        newsTitle="한국은행, 기준금리 동결"
        question="대출 있으세요?"
        followUp="하반기 인하 가능성이 60%래요."
        bookmarked
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
