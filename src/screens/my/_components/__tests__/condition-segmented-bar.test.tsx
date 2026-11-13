import { render, screen } from "@testing-library/react-native";

import { ConditionSegmentedBar } from "../condition-segmented-bar";

const segmentGrows = () => {
  const bar = screen.toJSON();
  if (!bar || Array.isArray(bar)) throw new Error("막대가 하나여야 한다");
  return bar.children?.map((child) =>
    typeof child === "string" ? null : child.props.style.flexGrow,
  );
};

describe("ConditionSegmentedBar", () => {
  it("맑음·보통·흐림·비 순서로 일수 비율만큼 폭을 나눈다", async () => {
    await render(
      <ConditionSegmentedBar
        counts={{ sunny: 62, default: 54, cloudy: 32, rain: 16 }}
      />,
    );
    expect(segmentGrows()).toEqual([62, 54, 32, 16]);
  });

  it("0일인 컨디션은 폭을 차지하지 않는다", async () => {
    await render(
      <ConditionSegmentedBar
        counts={{ sunny: 3, default: 0, cloudy: 1, rain: 0 }}
      />,
    );
    expect(segmentGrows()).toEqual([3, 0, 1, 0]);
  });
});
