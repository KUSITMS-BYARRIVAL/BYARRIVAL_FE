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

  // jest에서는 className이 style로 바뀌지 않아 색 대신 덮개 유무만 본다
  it("누르고 있으면 아이콘 뒤에 덮개를 깐다", async () => {
    await render(<ShareButton testOnly_pressed />);
    const button = screen.getByRole("button", { name: "공유하기" });
    expect(button.children).toHaveLength(2);
  });

  it("누르지 않으면 덮개가 없다", async () => {
    await render(<ShareButton />);
    const button = screen.getByRole("button", { name: "공유하기" });
    expect(button.children).toHaveLength(1);
  });
});
