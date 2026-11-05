import { render, screen } from "@testing-library/react-native";

import { ArrivalHero } from "../arrival-hero";

type Node = { type: string; children?: Node[] };

// .svg import는 Jest에서 SvgMock 호스트 요소로 대체된다 (__mocks__/svg-mock.js)
const countSvgs = (node: Node): number =>
  (node.type === "SvgMock" ? 1 : 0) +
  (node.children ?? []).reduce((sum, child) => sum + countSvgs(child), 0);

describe("ArrivalHero", () => {
  it("지하철 배경과 곰 일러스트를 함께 렌더한다", async () => {
    await render(<ArrivalHero />);
    expect(countSvgs(screen.toJSON() as unknown as Node)).toBe(2);
  });
});
