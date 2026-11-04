import { render, screen, userEvent } from "@testing-library/react-native";

import { SocialLoginButton } from "../social-login-button";

describe("SocialLoginButton", () => {
  it.each([
    ["apple", "Apple로 로그인하기"],
    ["kakao", "카카오로 로그인하기"],
  ] as const)("%s는 '%s' 버튼으로 보인다", async (provider, name) => {
    await render(<SocialLoginButton provider={provider} />);
    expect(screen.getByRole("button", { name })).toBeOnTheScreen();
  });

  it("누르면 onPress를 호출한다", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(<SocialLoginButton provider="kakao" onPress={onPress} />);
    await user.press(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
