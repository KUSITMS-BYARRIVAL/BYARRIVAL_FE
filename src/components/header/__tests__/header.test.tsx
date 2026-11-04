import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { Header } from "../header";

describe("Header", () => {
  it("onBack이 있을 때만 뒤로가기 버튼을 표시한다", async () => {
    await render(<Header title="알림" />);
    expect(screen.queryByRole("button", { name: "뒤로가기" })).toBeNull();
  });

  it("뒤로가기 버튼을 누르면 onBack을 호출한다", async () => {
    const onBack = jest.fn();
    await render(<Header title="알림" onBack={onBack} />);
    await fireEvent.press(screen.getByRole("button", { name: "뒤로가기" }));
    expect(onBack).toHaveBeenCalled();
  });

  it("title과 right를 표시한다", async () => {
    await render(<Header title="알림" right={<Text>모두읽음</Text>} />);
    expect(screen.getByRole("header", { name: "알림" })).toBeOnTheScreen();
    expect(screen.getByText("모두읽음")).toBeOnTheScreen();
  });
});
