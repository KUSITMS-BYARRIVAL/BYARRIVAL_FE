import { fireEvent, render, screen } from "@testing-library/react-native";

import { Toast } from "../toast";

describe("Toast", () => {
  it("라벨이 없으면 메시지만 렌더하고 버튼이 없다", async () => {
    await render(<Toast message="닉네임을 바꿨어요" />);
    expect(screen.getByText("닉네임을 바꿨어요")).toBeOnTheScreen();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("라벨이 있으면 라벨 버튼을 누를 때 onLabelPress를 호출한다", async () => {
    const handleLabelPress = jest.fn();
    await render(
      <Toast
        message="보관함에 담았어요"
        label="보러가기"
        onLabelPress={handleLabelPress}
      />,
    );
    fireEvent.press(screen.getByRole("button", { name: "보러가기" }));
    expect(handleLabelPress).toHaveBeenCalledTimes(1);
  });
});
