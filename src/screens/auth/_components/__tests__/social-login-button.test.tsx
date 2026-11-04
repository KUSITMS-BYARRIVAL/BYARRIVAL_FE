import { fireEvent, render, screen } from "@testing-library/react-native";

import { SocialLoginButton } from "../social-login-button";

describe("SocialLoginButton", () => {
  it("Apple은 검은 배경에 Apple 로그인 문구를 쓴다", async () => {
    await render(<SocialLoginButton provider="apple" />);
    const button = screen.getByRole("button", { name: "Apple로 로그인하기" });
    expect(button.props.className).toContain("bg-btn-apple");
  });

  it("카카오는 노란 배경에 카카오 로그인 문구를 쓴다", async () => {
    await render(<SocialLoginButton provider="kakao" />);
    const button = screen.getByRole("button", { name: "카카오로 로그인하기" });
    expect(button.props.className).toContain("bg-btn-kakao");
  });

  it("누르면 onPress를 호출한다", async () => {
    const onPress = jest.fn();
    await render(<SocialLoginButton provider="kakao" onPress={onPress} />);
    await fireEvent.press(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
