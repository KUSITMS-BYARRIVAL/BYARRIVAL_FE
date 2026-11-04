import { fireEvent, render, screen } from "@testing-library/react-native";

import { TextField } from "../text-field";

describe("TextField", () => {
  it("입력하면 onChangeText를 호출한다", async () => {
    const onChangeText = jest.fn();
    await render(
      <TextField placeholder="닉네임" onChangeText={onChangeText} />,
    );
    await fireEvent.changeText(
      screen.getByPlaceholderText("닉네임"),
      "안녕하세요",
    );
    expect(onChangeText).toHaveBeenCalledWith("안녕하세요");
  });

  it("maxLength가 있으면 도움말과 글자 수를 표시한다", async () => {
    await render(
      <TextField value="안녕하세요" maxLength={10} helperText="Help text" />,
    );
    expect(screen.getByText("Help text")).toBeOnTheScreen();
    expect(screen.getByText("5/10")).toBeOnTheScreen();
  });

  it("도움말과 maxLength가 없으면 아래 줄을 표시하지 않는다", async () => {
    await render(<TextField value="안녕하세요" />);
    expect(screen.queryByText(/\/\d+$/)).toBeNull();
  });
});
