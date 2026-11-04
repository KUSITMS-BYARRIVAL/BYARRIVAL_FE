import { fireEvent, render, screen } from "@testing-library/react-native";

import { Bubble } from "../bubble";

describe("Bubble", () => {
  it("텍스트를 렌더하고 누르면 onPress를 호출한다", async () => {
    const onPress = jest.fn();
    await render(<Bubble text="대출 있으세요?" onPress={onPress} />);
    await fireEvent.press(screen.getByText("대출 있으세요?"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("버튼으로 안내하지 않는다", async () => {
    await render(<Bubble text="대출 있으세요?" />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
