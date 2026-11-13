import { render, screen, userEvent } from "@testing-library/react-native";

import { TrendingSection } from "../trending-section";

const ARTICLES = {
  jobGroup: [
    { title: "직군 기사 1", url: "https://example.com/j1", viewers: 1234 },
    { title: "직군 기사 2", url: "https://example.com/j2", viewers: 97 },
  ],
  all: [{ title: "전체 기사 1", url: "https://example.com/a1", viewers: 64 }],
};

const renderSection = (
  props: Partial<Parameters<typeof TrendingSection>[0]> = {},
) =>
  render(
    <TrendingSection
      jobGroup="기획·마케팅"
      route="출근길"
      person="직장인"
      articles={ARTICLES}
      isReady
      onSeeAllPress={jest.fn()}
      onArticlePress={jest.fn()}
      {...props}
    />,
  );

const jobGroupChip = () =>
  screen.getByRole("button", { name: "내 직군 · 기획·마케팅" });
const allChip = () => screen.getByRole("button", { name: "전체" });

describe("TrendingSection", () => {
  it("기본은 내 직군 칩이 선택되고 직군 기사 목록을 보여준다", async () => {
    await renderSection();
    expect(jobGroupChip()).toBeSelected();
    expect(allChip()).not.toBeSelected();
    expect(screen.getByText("직군 기사 1")).toBeOnTheScreen();
    expect(screen.getByText("직군 기사 2")).toBeOnTheScreen();
    expect(screen.queryByText("전체 기사 1")).toBeNull();
  });

  it("전체 칩을 누르면 전체 기사 목록으로 바뀌고 전체 칩이 선택된다", async () => {
    const user = userEvent.setup();
    await renderSection();
    await user.press(allChip());
    expect(allChip()).toBeSelected();
    expect(jobGroupChip()).not.toBeSelected();
    expect(screen.getByText("전체 기사 1")).toBeOnTheScreen();
    expect(screen.queryByText("직군 기사 1")).toBeNull();
  });

  it("전체에서 내 직군 칩을 다시 누르면 직군 기사 목록으로 돌아온다", async () => {
    const user = userEvent.setup();
    await renderSection();
    await user.press(allChip());
    await user.press(jobGroupChip());
    expect(jobGroupChip()).toBeSelected();
    expect(screen.getByText("직군 기사 1")).toBeOnTheScreen();
    expect(screen.queryByText("전체 기사 1")).toBeNull();
  });

  it("유형별 길 이름을 제목에 넣는다", async () => {
    await renderSection({ route: "이동길" });
    expect(screen.getByText("지금 이동길에서 많이 봐요")).toBeOnTheScreen();
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
    await user.press(screen.getByText("직군 기사 2"));
    expect(onArticlePress).toHaveBeenCalledWith("https://example.com/j2");
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
    expect(screen.queryByText("직군 기사 1")).toBeNull();
    expect(jobGroupChip()).toBeOnTheScreen();
    expect(allChip()).toBeOnTheScreen();
  });

  it("선택한 범위의 기사가 없으면 기사 행을 그리지 않는다", async () => {
    await renderSection({ articles: { jobGroup: [], all: [] } });
    expect(screen.queryByText(/명이 보고 있어요/)).toBeNull();
  });
});
