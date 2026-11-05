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
});
