import { render, screen } from "@testing-library/react-native";

import { ProfileScreen } from "../profile";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({
  router: { back: jest.fn(), push: jest.fn() },
}));

describe("ProfileScreen", () => {
  it("닉네임과 현재 설정 값을 목록에 보여준다", async () => {
    await render(<ProfileScreen />);
    expect(screen.getByText("출근러")).toBeOnTheScreen();
    expect(screen.getByText("직장인")).toBeOnTheScreen();
    expect(screen.getByText("IT개발·데이터")).toBeOnTheScreen();
    expect(screen.getByText("서울 강남구")).toBeOnTheScreen();
    expect(screen.getByText("경제·금융, 건강·생활")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "로그아웃" })).toBeOnTheScreen();
  });
});
