import { render, screen, userEvent } from "@testing-library/react-native";

import { TrendingSection } from "../trending-section";

const ARTICLES = {
  region: [
    { title: "지역 기사 1", url: "https://example.com/r1", viewers: 1234 },
    { title: "지역 기사 2", url: "https://example.com/r2", viewers: 97 },
  ],
  all: [{ title: "전체 기사 1", url: "https://example.com/a1", viewers: 64 }],
};

const renderSection = (
  props: Partial<Parameters<typeof TrendingSection>[0]> = {},
) =>
  render(
    <TrendingSection
      region="여의도"
      articles={ARTICLES}
      isReady
      onSeeAllPress={jest.fn()}
      onArticlePress={jest.fn()}
      {...props}
    />,
  );

const regionChip = () =>
  screen.getByRole("button", { name: "내 지역 · 여의도" });
const allChip = () => screen.getByRole("button", { name: "전체" });

describe("TrendingSection", () => {
  it("기본은 내 지역 칩이 선택되고 지역 기사 목록을 보여준다", async () => {
    await renderSection();
    expect(regionChip()).toBeSelected();
    expect(allChip()).not.toBeSelected();
    expect(screen.getByText("지역 기사 1")).toBeOnTheScreen();
    expect(screen.getByText("지역 기사 2")).toBeOnTheScreen();
    expect(screen.queryByText("전체 기사 1")).toBeNull();
  });

  it("전체 칩을 누르면 전체 기사 목록으로 바뀌고 전체 칩이 선택된다", async () => {
    const user = userEvent.setup();
    await renderSection();
    await user.press(allChip());
    expect(allChip()).toBeSelected();
    expect(regionChip()).not.toBeSelected();
    expect(screen.getByText("전체 기사 1")).toBeOnTheScreen();
    expect(screen.queryByText("지역 기사 1")).toBeNull();
  });

  it("전체에서 내 지역 칩을 다시 누르면 지역 기사 목록으로 돌아온다", async () => {
    const user = userEvent.setup();
    await renderSection();
    await user.press(allChip());
    await user.press(regionChip());
    expect(regionChip()).toBeSelected();
    expect(screen.getByText("지역 기사 1")).toBeOnTheScreen();
    expect(screen.queryByText("전체 기사 1")).toBeNull();
  });

  it("보고 있는 사람 수를 천 단위로 구분해 보여준다", async () => {
    await renderSection();
    expect(
      screen.getByText("오늘 출근길 직장인 1,234명이 보고 있어요"),
    ).toBeOnTheScreen();
  });

  it("기사를 누르면 그 기사의 url로 onArticlePress를 호출한다", async () => {
    const user = userEvent.setup();
    const onArticlePress = jest.fn();
    await renderSection({ onArticlePress });
    await user.press(screen.getByText("지역 기사 2"));
    expect(onArticlePress).toHaveBeenCalledWith("https://example.com/r2");
  });

  it("전체보기를 누르면 onSeeAllPress를 호출한다", async () => {
    const user = userEvent.setup();
    const onSeeAllPress = jest.fn();
    await renderSection({ onSeeAllPress });
    await user.press(screen.getByRole("button", { name: "전체보기" }));
    expect(onSeeAllPress).toHaveBeenCalledTimes(1);
  });

  it("집계 전이면 기사 목록 대신 집계중 카드를 보여주고 칩은 그대로 둔다", async () => {
    await renderSection({ isReady: false });
    expect(screen.getByText("데이터를 집계중이에요")).toBeOnTheScreen();
    expect(screen.queryByText("지역 기사 1")).toBeNull();
    expect(regionChip()).toBeOnTheScreen();
    expect(allChip()).toBeOnTheScreen();
  });

  it("선택한 범위의 기사가 없으면 기사 행을 그리지 않는다", async () => {
    await renderSection({ articles: { region: [], all: [] } });
    expect(screen.queryByText(/명이 보고 있어요/)).toBeNull();
  });
});
