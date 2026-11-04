import { fireEvent, render, screen } from "@testing-library/react-native";

import { AchievementCard } from "../achievement-card";
import { NewsCard } from "../news-card";
import { ScrappedArticleCard } from "../scrapped-article-card";
import { SmalltalkCard } from "../smalltalk-card";
import { SummaryCard } from "../summary-card";
import { TermCard } from "../term-card";

describe("SmalltalkCard", () => {
  it("장소·질문·이어서 문구를 보여주고 누르면 onPress를 호출한다", async () => {
    const onPress = jest.fn();
    await render(
      <SmalltalkCard
        place="엘리베이터에서"
        question="대출 있으세요?"
        followUp="하반기엔 내릴 가능성이 60%라던데요."
        onPress={onPress}
      />,
    );
    expect(screen.getByText("엘리베이터에서")).toBeOnTheScreen();
    expect(
      screen.getByText("이어서 · 하반기엔 내릴 가능성이 60%라던데요."),
    ).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe("TermCard", () => {
  it("용어와 설명을 보여주고 누르면 onPress를 호출한다", async () => {
    const onPress = jest.fn();
    await render(
      <TermCard
        category="economy"
        categoryLabel="경제"
        term="기준금리"
        definition="한국은행이 정하는 금리의 기준선."
        onPress={onPress}
      />,
    );
    expect(screen.getByText("기준금리")).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe("ScrappedArticleCard", () => {
  it("스크랩 시각·제목·AI 요약을 보여주고 북마크를 누르면 onBookmarkPress를 호출한다", async () => {
    const onBookmarkPress = jest.fn();
    await render(
      <ScrappedArticleCard
        category="economy"
        categoryLabel="경제"
        scrappedAt="13:32"
        title="한국은행, 기준금리 동결"
        imageUrl="https://example.com/a.png"
        aiSummary="엑시노스 2600, Apple NPU의 85% 성능 달성"
        bookmarked
        onBookmarkPress={onBookmarkPress}
      />,
    );
    expect(screen.getByText("13:32")).toBeOnTheScreen();
    expect(
      screen.getByText("엑시노스 2600, Apple NPU의 85% 성능 달성"),
    ).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "북마크" }));
    expect(onBookmarkPress).toHaveBeenCalledTimes(1);
  });
});

describe("NewsCard", () => {
  it("읽는 시간과 제목을 보여준다", async () => {
    await render(
      <NewsCard
        category="economy"
        categoryLabel="경제"
        readMinutes={2}
        title="한국은행, 기준금리 동결"
        imageUrl="https://example.com/a.png"
      />,
    );
    expect(screen.getByText("2분")).toBeOnTheScreen();
    expect(screen.getByText("한국은행, 기준금리 동결")).toBeOnTheScreen();
  });
});

describe("SummaryCard", () => {
  it("요약 항목마다 1부터 번호를 붙인다", async () => {
    await render(<SummaryCard points={["첫째", "둘째", "셋째"]} />);
    expect(screen.getByText("3")).toBeOnTheScreen();
    expect(screen.getByText("셋째")).toBeOnTheScreen();
  });
});

describe("AchievementCard", () => {
  it.each(["horizontal", "vertical"] as const)(
    "%s 배치에서 제목과 설명을 보여준다",
    async (orientation) => {
      await render(
        <AchievementCard
          title="축하합니다! 당신은 1등 갓생러"
          description="데이터를 집계중입니다"
          orientation={orientation}
        />,
      );
      expect(
        screen.getByText("축하합니다! 당신은 1등 갓생러"),
      ).toBeOnTheScreen();
    },
  );
});
