import { render, screen } from "@testing-library/react-native";

import { ConditionCard } from "../condition-card";

const MESSAGE = "이번 달은 맑은 날이 가장 많았어요!\n컨디션이 좋아 보여요";

describe("ConditionCard", () => {
  it("범례에 컨디션별 일수를 표시한다", async () => {
    await render(
      <ConditionCard
        counts={{ sunny: 62, default: 54, cloudy: 32, rain: 16 }}
        message={MESSAGE}
      />,
    );
    expect(screen.getByText("맑음 62일")).toBeOnTheScreen();
    expect(screen.getByText("보통 54일")).toBeOnTheScreen();
    expect(screen.getByText("흐림 32일")).toBeOnTheScreen();
    expect(screen.getByText("비 16일")).toBeOnTheScreen();
  });

  it("서버 문구를 말풍선에 그대로 표시한다", async () => {
    await render(
      <ConditionCard
        counts={{ sunny: 1, default: 0, cloudy: 0, rain: 0 }}
        message={MESSAGE}
      />,
    );
    expect(screen.getByText(MESSAGE)).toBeOnTheScreen();
  });

  it("모든 일수가 0이면 범례를 0일로 표시한다", async () => {
    await render(
      <ConditionCard
        counts={{ sunny: 0, default: 0, cloudy: 0, rain: 0 }}
        message={MESSAGE}
      />,
    );
    expect(screen.getByText("맑음 0일")).toBeOnTheScreen();
    expect(screen.getByText("보통 0일")).toBeOnTheScreen();
    expect(screen.getByText("흐림 0일")).toBeOnTheScreen();
    expect(screen.getByText("비 0일")).toBeOnTheScreen();
  });
});
