import { render, screen } from "@testing-library/react-native";

import { useOnboardingStore } from "@/stores/onboarding-store";

import { OnboardingCompleteScreen } from "../complete";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

describe("OnboardingCompleteScreen", () => {
  it("고른 유형·출발 시각·관심 분야를 요약해 보여준다", async () => {
    useOnboardingStore.setState({
      userType: "student",
      departureTime: { hour: 18, minute: 5 },
      interests: ["tech", "economy"],
    });
    await render(<OnboardingCompleteScreen />);

    expect(screen.getByRole("header")).toHaveTextContent("준비 완료!");
    expect(screen.getByText("학생")).toBeOnTheScreen();
    expect(screen.getByText("오후 6:05")).toBeOnTheScreen();
    // 고른 순서가 아니라 화면 목록 순서로 보여준다
    expect(screen.getByText("경제, 테크")).toBeOnTheScreen();
  });

  it("자정·정오는 12시로 표기한다", async () => {
    useOnboardingStore.setState({ departureTime: { hour: 0, minute: 0 } });
    await render(<OnboardingCompleteScreen />);
    expect(screen.getByText("오전 12:00")).toBeOnTheScreen();
  });
});
