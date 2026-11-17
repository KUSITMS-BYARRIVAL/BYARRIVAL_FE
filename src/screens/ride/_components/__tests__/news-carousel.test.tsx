import {
  fireEvent,
  render,
  screen,
  userEvent,
} from "@testing-library/react-native";
import { Dimensions } from "react-native";

import { NewsCarousel } from "../news-carousel";

const ARTICLES = [
  {
    category: "economy" as const,
    label: "경제",
    title: "한국은행, 기준금리 동결",
    minutes: 2,
    image: "https://example.com/a.png",
    summary: ["기준금리 연 3.00% 동결 결정"],
  },
  {
    category: "economy" as const,
    label: "경제",
    title: "코스피 2,600 회복",
    minutes: 3,
    image: "https://example.com/b.png",
    summary: ["외국인 순매수 전환"],
  },
];

const renderCarousel = (
  props: Partial<React.ComponentProps<typeof NewsCarousel>> = {},
) =>
  render(
    <NewsCarousel
      articles={ARTICLES}
      isSelected={() => false}
      onToggle={jest.fn()}
      onIndexChange={jest.fn()}
      {...props}
    />,
  );

describe("NewsCarousel", () => {
  it("기사 제목을 모두 보여준다", async () => {
    await renderCarousel();
    expect(screen.getByText("한국은행, 기준금리 동결")).toBeOnTheScreen();
    expect(screen.getByText("코스피 2,600 회복")).toBeOnTheScreen();
  });

  it("카드를 누르면 제목과 읽는 시간으로 onToggle을 부른다", async () => {
    const onToggle = jest.fn();
    const user = userEvent.setup();
    await renderCarousel({ onToggle });
    await user.press(screen.getByText("코스피 2,600 회복"));
    expect(onToggle).toHaveBeenCalledWith("코스피 2,600 회복", 3);
  });

  it("고른 카드만 선택 상태로 알린다", async () => {
    await renderCarousel({
      isSelected: (title) => title === "한국은행, 기준금리 동결",
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
});
