import { render } from "@testing-library/react-native";

import { ScrollDownIndicator } from "../scroll-down-indicator";

describe("ScrollDownIndicator", () => {
  it("일러스트 위에 겹쳐도 터치를 가로채지 않는다", async () => {
    const { toJSON } = await render(<ScrollDownIndicator />);
    expect(toJSON()).toHaveProp("pointerEvents", "none");
  });
});
