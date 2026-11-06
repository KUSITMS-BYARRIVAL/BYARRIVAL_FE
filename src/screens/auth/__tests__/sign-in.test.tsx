import { render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import { SignInScreen } from "../sign-in";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
  useFocusEffect: jest.fn(),
}));

// 버튼마다 이동을 따로 확인하도록 이전 테스트의 호출 기록을 지운다
beforeEach(() => jest.clearAllMocks());

describe("SignInScreen", () => {
  it.each(["Apple로 로그인하기", "카카오로 로그인하기"])(
    "%s를 누르면 닉네임 입력으로 넘어간다",
    async (name) => {
      const user = userEvent.setup();
      await render(<SignInScreen />);
      await user.press(screen.getByRole("button", { name }));
      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).toHaveBeenCalledWith("/nickname");
    },
  );
});
