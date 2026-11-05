import { render, screen, userEvent } from "@testing-library/react-native";

import { ShareButton } from "../share-button";

describe("ShareButton", () => {
  it("공유하기 버튼을 누르면 onPress를 호출한다", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(<ShareButton onPress={onPress} />);
    await user.press(screen.getByRole("button", { name: "공유하기" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
