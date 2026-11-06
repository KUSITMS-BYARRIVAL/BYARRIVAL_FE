import { fireEvent, render, screen } from "@testing-library/react-native";

import { type RideArticle, StopArticle } from "../stop-article";

const ARTICLE: RideArticle = {
  category: "economy",
  label: "경제",
  title: "한국은행, 기준금리 동결",
  minutes: 2,
  date: "2026.11.04",
  press: "한국경제",
  keywords: ["#금리", "#오늘의 브리핑"],
  url: "https://example.com/article",
  image: "https://example.com/a.png",
};

const renderArticle = (
  article: Partial<RideArticle> = {},
  onOriginalPress = jest.fn(),
) =>
  render(
    <StopArticle
      article={{ ...ARTICLE, ...article }}
      onOriginalPress={onOriginalPress}
    />,
  );

describe("StopArticle", () => {
  it("제목 · 날짜 · 언론사를 보여준다", async () => {
    await renderArticle();
    expect(screen.getByText("한국은행, 기준금리 동결")).toBeOnTheScreen();
    expect(screen.getByText("2026.11.04")).toBeOnTheScreen();
    expect(screen.getByText("한국경제")).toBeOnTheScreen();
  });

  it("읽는 시간을 'N분 완독'으로 보여준다", async () => {
    await renderArticle({ minutes: 5 });
    expect(screen.getByText("5분 완독")).toBeOnTheScreen();
  });

  it("읽는 시간이 0이어도 '0분 완독'으로 보여준다", async () => {
    await renderArticle({ minutes: 0 });
    expect(screen.getByText("0분 완독")).toBeOnTheScreen();
  });

  it("키워드를 모두 보여준다", async () => {
    await renderArticle();
    expect(screen.getByText("#금리")).toBeOnTheScreen();
    expect(screen.getByText("#오늘의 브리핑")).toBeOnTheScreen();
  });

  it("키워드가 없으면 '핵심 키워드' 라벨만 보여준다", async () => {
    await renderArticle({ keywords: [] });
    expect(screen.getByText("핵심 키워드")).toBeOnTheScreen();
    expect(screen.queryByText(/^#/)).toBeNull();
  });

  it("'원문 보기'를 누르면 onOriginalPress를 한 번 호출한다", async () => {
    const onOriginalPress = jest.fn();
    await renderArticle({}, onOriginalPress);
    await fireEvent.press(screen.getByText("원문 보기"));
    expect(onOriginalPress).toHaveBeenCalledTimes(1);
  });
});
