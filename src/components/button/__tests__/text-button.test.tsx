import { fireEvent, render, screen } from "@testing-library/react-native";

import { TextButton } from "../text-button";

describe("TextButton", () => {
  it("레이블을 렌더하고 누르면 onPress를 호출한다", async () => {
    const onPress = jest.fn();
    await render(<TextButton label="더보기" onPress={onPress} />);
    await fireEvent.press(screen.getByRole("button", { name: "더보기" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("disabled면 눌러도 onPress를 호출하지 않는다", async () => {
    const onPress = jest.fn();
    await render(<TextButton label="모두 읽음" disabled onPress={onPress} />);
    await fireEvent.press(screen.getByRole("button", { name: "모두 읽음" }));
    expect(onPress).not.toHaveBeenCalled();
  });
});
