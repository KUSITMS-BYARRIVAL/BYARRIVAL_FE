import { fireEvent, render, screen } from "@testing-library/react-native";

import { TextButton } from "../text-button";

describe("TextButton", () => {
  it("레이블을 렌더하고 누르면 onPress를 호출한다", async () => {
    const onPress = jest.fn();
    await render(<TextButton label="더보기" onPress={onPress} />);
    await fireEvent.press(screen.getByRole("button", { name: "더보기" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
