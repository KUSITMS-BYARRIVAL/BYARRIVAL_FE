import { render, screen, userEvent } from "@testing-library/react-native";

import { RankingRow } from "../ranking-row";

describe("RankingRow", () => {
  it("순위·제목·보조 문구를 보여주고 누르면 onPress를 호출한다", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(
      <RankingRow
        rank={1}
        title="한국은행, 기준금리 동결"
        subtext="경제 · 2분 · 12,840명 읽음"
        onPress={onPress}
      />,
    );
    expect(screen.getByText("1")).toBeOnTheScreen();
    expect(screen.getByText("경제 · 2분 · 12,840명 읽음")).toBeOnTheScreen();
    await user.press(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("실시간 문구도 그대로 보여준다", async () => {
    await render(
      <RankingRow
        rank={2}
        title="AI 반도체 급등"
        subtext="오늘 출근길 직장인 97명이 보고 있어요"
        isLive
        hasArrow={false}
      />,
    );
    expect(
      screen.getByText("오늘 출근길 직장인 97명이 보고 있어요"),
    ).toBeOnTheScreen();
  });

  it("rankTone을 주지 않으면 순위 원이 회색 배경에 secondary 숫자다", async () => {
    await render(<RankingRow rank={1} title="제목" subtext="보조 문구" />);
    const rank = screen.getByText("1");
    expect(rank.props.className).toContain("text-secondary");
    expect(rank.parent!.props.className).toContain("bg-icon-background");
  });

  it("rankTone이 brand면 순위 원이 초록 배경에 흰 숫자다", async () => {
    await render(
      <RankingRow rank={1} title="제목" subtext="보조 문구" rankTone="brand" />,
    );
    const rank = screen.getByText("1");
    expect(rank.props.className).toContain("text-on-fill-default");
    expect(rank.parent!.props.className).toContain("bg-green-500");
  });

  it("titleNumberOfLines를 주지 않으면 제목 줄 수 제한이 없다", async () => {
    await render(<RankingRow rank={1} title="제목" subtext="보조 문구" />);
    expect(screen.getByText("제목").props.numberOfLines).toBeUndefined();
  });

  it("titleNumberOfLines가 1이면 제목만 한 줄로 제한한다", async () => {
    await render(
      <RankingRow
        rank={1}
        title="제목"
        subtext="보조 문구"
        titleNumberOfLines={1}
      />,
    );
    expect(screen.getByText("제목").props.numberOfLines).toBe(1);
    expect(screen.getByText("보조 문구").props.numberOfLines).toBeUndefined();
  });

  it("화살표가 있으면 제목 최대 너비가 245, 없으면 제한이 없다", async () => {
    const { rerender } = await render(
      <RankingRow rank={1} title="제목" subtext="보조 문구" />,
    );
    expect(screen.getByText("제목").props.className).toContain("max-w-[245px]");
    await rerender(
      <RankingRow rank={1} title="제목" subtext="보조 문구" hasArrow={false} />,
    );
    expect(screen.getByText("제목").props.className).not.toContain("max-w");
  });
});
