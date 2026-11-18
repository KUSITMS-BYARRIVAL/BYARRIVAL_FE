import { fireEvent, render, screen } from "@testing-library/react-native";

import type { RouteStop } from "@/types/ride/ride.types";

import { StopArticle } from "../stop-article";

const STOP: RouteStop = {
  routeId: 7,
  stopNumber: 1,
  totalStops: 3,
  available: true,
  articleId: 11,
  title: "한국은행, 기준금리 동결",
  pressName: "한국경제",
  // 기기 시간대와 상관없이 같은 날짜가 되도록 정오로 둔다
  publishedAt: "2026-11-04T12:00:00",
  categoryId: 4,
  categoryName: "경제·금융",
  readingMinutes: 2,
  keywords: ["금리", "#오늘의 브리핑"],
  oneLine: "",
  summary: ["기준금리 연 3.00% 동결", "물가 안정세 고려"],
  sourceUrl: "https://example.com/article",
  read: false,
  scrapped: false,
  progress: {
    totalStops: 3,
    readCount: 0,
    currentStop: 1,
    remainingStops: 3,
    remainingMinutes: 7,
    arrivable: false,
  },
};

const renderArticle = (
  stop: Partial<RouteStop> = {},
  onOriginalPress = jest.fn(),
) =>
  render(
    <StopArticle
      stop={{ ...STOP, ...stop }}
      onOriginalPress={onOriginalPress}
    />,
  );

describe("StopArticle", () => {
  it("카테고리 · 제목 · 날짜 · 언론사를 보여준다", async () => {
    await renderArticle();
    expect(screen.getByText("경제·금융")).toBeOnTheScreen();
    expect(screen.getByText("한국은행, 기준금리 동결")).toBeOnTheScreen();
    expect(screen.getByText("2026.11.04")).toBeOnTheScreen();
    expect(screen.getByText("한국경제")).toBeOnTheScreen();
  });

  it("읽는 시간을 'N분 완독'으로 보여준다", async () => {
    await renderArticle({ readingMinutes: 5 });
    expect(screen.getByText("5분 완독")).toBeOnTheScreen();
  });

  it("읽는 시간이 0이어도 '0분 완독'으로 보여준다", async () => {
    await renderArticle({ readingMinutes: 0 });
    expect(screen.getByText("0분 완독")).toBeOnTheScreen();
  });

  it("키워드를 모두 보여주고 '#'이 없으면 붙인다", async () => {
    await renderArticle();
    expect(screen.getByText("#금리")).toBeOnTheScreen();
    expect(screen.getByText("#오늘의 브리핑")).toBeOnTheScreen();
  });

  it("키워드가 없으면 키워드 칩을 보여주지 않는다", async () => {
    await renderArticle({ keywords: [] });
    expect(screen.queryByText(/^#/)).toBeNull();
  });

  it("AI 요약을 번호와 함께 모두 보여준다", async () => {
    await renderArticle();
    expect(screen.getByText("AI가 요약한 핵심 내용")).toBeOnTheScreen();
    expect(screen.getByText("1")).toBeOnTheScreen();
    expect(screen.getByText("기준금리 연 3.00% 동결")).toBeOnTheScreen();
    expect(screen.getByText("2")).toBeOnTheScreen();
    expect(screen.getByText("물가 안정세 고려")).toBeOnTheScreen();
  });

  it("'원문 보기'를 누르면 onOriginalPress를 한 번 호출한다", async () => {
    const onOriginalPress = jest.fn();
    await renderArticle({}, onOriginalPress);
    await fireEvent.press(screen.getByText("원문 보기"));
    expect(onOriginalPress).toHaveBeenCalledTimes(1);
  });
});
