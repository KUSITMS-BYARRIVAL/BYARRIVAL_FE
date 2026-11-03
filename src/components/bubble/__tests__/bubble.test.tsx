import { fireEvent, render, screen } from "@testing-library/react-native";

import { Bubble } from "../bubble";

describe("Bubble", () => {
  it("텍스트를 렌더하고 누르면 onPress를 호출한다", async () => {
    const onPress = jest.fn();
    await render(<Bubble text="대출 있으세요?" onPress={onPress} />);
    await fireEvent.press(
      screen.getByRole("button", { name: "대출 있으세요?" }),
    );
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
