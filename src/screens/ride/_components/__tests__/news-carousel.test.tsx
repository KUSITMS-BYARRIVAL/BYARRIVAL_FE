import {
  fireEvent,
  render,
  screen,
  userEvent,
} from "@testing-library/react-native";
import { Dimensions } from "react-native";

import type { RouteCard } from "@/types/ride/ride.types";

import { NewsCarousel } from "../news-carousel";

const card = (overrides: Partial<RouteCard>): RouteCard => ({
  cardOrder: 1,
  articleId: 1,
  title: "",
  categoryId: 4,
  categoryName: "경제·금융",
  pressName: "한국경제",
  difficulty: "EASY",
  readingMinutes: 2,
  oneLine: "",
  recommended: true,
  carted: false,
  cartOrder: null,
  addable: true,
  read: false,
  ...overrides,
});

const CARDS = [
  card({
    cardOrder: 1,
    articleId: 11,
    title: "한국은행, 기준금리 동결",
    oneLine: "기준금리 연 3.00% 동결 결정",
  }),
  card({
    cardOrder: 2,
    articleId: 12,
    title: "코스피 2,600 회복",
    readingMinutes: 3,
    oneLine: "외국인 순매수 전환",
  }),
];

const renderCarousel = (
  props: Partial<React.ComponentProps<typeof NewsCarousel>> = {},
) =>
  render(
    <NewsCarousel
      cards={CARDS}
      onToggle={jest.fn()}
      onIndexChange={jest.fn()}
      {...props}
    />,
  );

describe("NewsCarousel", () => {
  it("카드마다 제목 · 카테고리 · 읽는 시간 · 한 줄 요약을 보여준다", async () => {
    await renderCarousel();
    expect(screen.getByText("한국은행, 기준금리 동결")).toBeOnTheScreen();
    expect(screen.getByText("코스피 2,600 회복")).toBeOnTheScreen();
    expect(screen.getAllByText("경제·금융")).toHaveLength(2);
    expect(screen.getByText("3분")).toBeOnTheScreen();
    expect(screen.getByText("외국인 순매수 전환")).toBeOnTheScreen();
  });

  it("카드를 누르면 그 카드로 onToggle을 부른다", async () => {
    const onToggle = jest.fn();
    const user = userEvent.setup();
    await renderCarousel({ onToggle });
    await user.press(screen.getByText("코스피 2,600 회복"));
    expect(onToggle).toHaveBeenCalledWith(CARDS[1]);
  });

  it("담은(carted) 카드만 선택 상태로 알린다", async () => {
    await renderCarousel({
      cards: [{ ...CARDS[0], carted: true }, CARDS[1]],
    });
    const [first, second] = screen.getAllByRole("checkbox");
    expect(first).toBeChecked();
    expect(second).not.toBeChecked();
  });

  it("스와이프로 가운데 카드가 바뀌면 그 순서로 onIndexChange를 부른다", async () => {
    const onIndexChange = jest.fn();
    await renderCarousel({ onIndexChange });
    // 카드 폭(화면 - 78) + 간격 14 만큼 넘기면 다음 카드
    const interval = Dimensions.get("window").width - 78 + 14;
    // 이벤트는 가장 가까운 스크롤 핸들러까지 올라간다
    await fireEvent(screen.getByText("한국은행, 기준금리 동결"), "scroll", {
      nativeEvent: { contentOffset: { x: interval } },
    });
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it.each([
    [-100, 0],
    [99999, 1],
  ])(
    "양끝을 넘겨 당겨도(offset %d) 카드 범위 안 순서 %d로 알린다",
    async (x, expected) => {
      const onIndexChange = jest.fn();
      await renderCarousel({ onIndexChange });
      await fireEvent(screen.getByText("한국은행, 기준금리 동결"), "scroll", {
        nativeEvent: { contentOffset: { x } },
      });
      expect(onIndexChange).toHaveBeenCalledWith(expected);
    },
  );
});
