import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { LogoHeader } from "../logo-header";

describe("LogoHeader", () => {
  it("onLogoPress가 있으면 로고가 버튼이 되고, 누르면 호출한다", async () => {
    const onLogoPress = jest.fn();
    await render(<LogoHeader onLogoPress={onLogoPress} />);
    await fireEvent.press(screen.getByRole("button", { name: "홈으로" }));
    expect(onLogoPress).toHaveBeenCalledTimes(1);
  });

  it("onLogoPress가 없으면 로고는 버튼이 아니다", async () => {
    await render(<LogoHeader />);
    expect(screen.queryByRole("button", { name: "홈으로" })).toBeNull();
  });

  it("right를 함께 그린다", async () => {
    await render(<LogoHeader right={<Text>오른쪽</Text>} />);
    expect(screen.getByText("오른쪽")).toBeTruthy();
  });
});
