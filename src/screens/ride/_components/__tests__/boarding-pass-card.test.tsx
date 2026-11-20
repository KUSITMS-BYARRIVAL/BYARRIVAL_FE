import { render, screen } from "@testing-library/react-native";

import type { RouteCard } from "@/types/ride/ride.types";

import { BoardingPassCard } from "../boarding-pass-card";

const card = (overrides: Partial<RouteCard>): RouteCard => ({
  cardOrder: 1,
  articleId: 1,
  title: "",
  categoryId: 4,
  categoryName: "경제·금융",
  pressName: "한국경제",
  difficulty: "EASY",
  readingMinutes: 3,
  oneLine: "",
  recommended: true,
  carted: true,
  cartOrder: 1,
  addable: true,
  read: false,
  ...overrides,
});

const CARDS = [
  card({ articleId: 1, title: "금리 동결", readingMinutes: 3 }),
  card({
    articleId: 2,
    title: "AI 검색",
    categoryId: 6,
    categoryName: "IT·기술",
    readingMinutes: 5,
  }),
  card({ articleId: 3, title: "유럽 증시", readingMinutes: 6 }),
];

describe("BoardingPassCard", () => {
  it("기사 수와 서버가 준 예상 시간을 보여준다", async () => {
    // 카드 시간 합(14분)이 아니라 서버가 소수 합을 올린 값을 그대로 쓴다
    await render(
      <BoardingPassCard from="집" to="회사" cards={CARDS} totalMinutes={15} />,
    );
    expect(screen.getByText("3개")).toBeOnTheScreen();
    expect(screen.getByText("15분")).toBeOnTheScreen();
  });

  it("기사마다 카테고리 · 제목 · 읽는 시간을 보여준다", async () => {
    await render(
      <BoardingPassCard from="집" to="회사" cards={CARDS} totalMinutes={14} />,
    );
    expect(screen.getByText("IT·기술")).toBeOnTheScreen();
    expect(screen.getByText("AI 검색")).toBeOnTheScreen();
    expect(screen.getByText("5분")).toBeOnTheScreen();
    expect(screen.getByText("유럽 증시")).toBeOnTheScreen();
    expect(screen.getByText("6분")).toBeOnTheScreen();
  });

  it("도착지가 세 글자여도 그대로 보여준다", async () => {
    await render(
      <BoardingPassCard
        from="집"
        to="도착지"
        cards={CARDS}
        totalMinutes={14}
      />,
    );
    expect(screen.getByText("집")).toBeOnTheScreen();
    expect(screen.getByText("도착지")).toBeOnTheScreen();
  });

  it("기사가 많아도 정거장 점은 10개까지만 그리고 기사 수는 그대로 보여준다", async () => {
    const many = Array.from({ length: 30 }, (_, i) =>
      card({ articleId: i + 1 }),
    );
    await render(
      <BoardingPassCard from="집" to="회사" cards={many} totalMinutes={72} />,
    );
    expect(screen.getByRole("progressbar")).toHaveAccessibilityValue({
      min: 1,
      max: 10,
    });
    expect(screen.getByText("30개")).toBeOnTheScreen();
  });

  it("기사가 없으면 0개 · 0분으로 보여준다", async () => {
    await render(
      <BoardingPassCard from="집" to="회사" cards={[]} totalMinutes={0} />,
    );
    expect(screen.getByText("0개")).toBeOnTheScreen();
    expect(screen.getByText("0분")).toBeOnTheScreen();
  });
});
