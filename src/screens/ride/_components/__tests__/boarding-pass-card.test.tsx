import { render, screen } from "@testing-library/react-native";

import { type BoardingArticle, BoardingPassCard } from "../boarding-pass-card";

const ARTICLES: BoardingArticle[] = [
  { category: "economy", label: "경제", title: "금리 동결", minutes: 3 },
  { category: "tech", label: "테크", title: "AI 검색", minutes: 5 },
  { category: "global", label: "글로벌", title: "유럽 증시", minutes: 6 },
];

describe("BoardingPassCard", () => {
  it("기사 수와 읽는 시간을 합친 예상 시간을 보여준다", async () => {
    await render(<BoardingPassCard from="집" to="회사" articles={ARTICLES} />);
    expect(screen.getByText("3개")).toBeOnTheScreen();
    expect(screen.getByText("14분")).toBeOnTheScreen();
  });

  it("기사마다 제목과 읽는 시간을 보여준다", async () => {
    await render(<BoardingPassCard from="집" to="회사" articles={ARTICLES} />);
    expect(screen.getByText("AI 검색")).toBeOnTheScreen();
    expect(screen.getByText("5분")).toBeOnTheScreen();
    expect(screen.getByText("유럽 증시")).toBeOnTheScreen();
    expect(screen.getByText("6분")).toBeOnTheScreen();
  });

  it("도착지가 세 글자여도 그대로 보여준다", async () => {
    await render(
      <BoardingPassCard from="집" to="도착지" articles={ARTICLES} />,
    );
    expect(screen.getByText("집")).toBeOnTheScreen();
    expect(screen.getByText("도착지")).toBeOnTheScreen();
  });

  it("기사가 없으면 0개 · 0분으로 보여준다", async () => {
    await render(<BoardingPassCard from="집" to="회사" articles={[]} />);
    expect(screen.getByText("0개")).toBeOnTheScreen();
    expect(screen.getByText("0분")).toBeOnTheScreen();
  });
});
