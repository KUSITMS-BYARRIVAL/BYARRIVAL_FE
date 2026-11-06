import { render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import { useOnboardingStore } from "@/stores/onboarding-store";

import { UserTypeScreen } from "../user-type";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({
  router: { back: jest.fn(), push: jest.fn() },
}));

beforeEach(() =>
  useOnboardingStore.setState({ nickname: "아침형", userType: null }),
);

const nextButton = () => screen.getByRole("button", { name: "다음으로" });

describe("UserTypeScreen", () => {
  it("입력한 닉네임으로 질문하고, 고르기 전에는 다음 버튼이 비활성이다", async () => {
    await render(<UserTypeScreen />);
    expect(
      screen.getByRole("header", { name: "아침형님은 어떤 유형이신가요?" }),
    ).toBeOnTheScreen();
    expect(nextButton()).toBeDisabled();
  });

  it("유형을 하나만 고를 수 있고 고르면 다음 버튼이 활성화된다", async () => {
    const user = userEvent.setup();
    await render(<UserTypeScreen />);
    await user.press(screen.getByRole("radio", { name: /학생/ }));
    expect(screen.getByRole("radio", { name: /학생/ })).toBeChecked();
    await user.press(screen.getByRole("radio", { name: /직장인/ }));
    expect(screen.getByRole("radio", { name: /직장인/ })).toBeChecked();
    expect(screen.getByRole("radio", { name: /학생/ })).not.toBeChecked();
    expect(useOnboardingStore.getState().userType).toBe("worker");
    expect(nextButton()).toBeEnabled();
  });

  it("유형을 고르고 다음을 누르면 출근 시각 설정으로 넘어간다", async () => {
    const user = userEvent.setup();
    await render(<UserTypeScreen />);
    await user.press(screen.getByRole("radio", { name: /기타/ }));
    await user.press(nextButton());
    expect(router.push).toHaveBeenCalledWith("/departure-time");
  });
});
