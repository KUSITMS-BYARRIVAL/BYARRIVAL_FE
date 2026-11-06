import { render, screen, userEvent } from "@testing-library/react-native";

import { useOnboardingStore } from "@/stores/onboarding-store";

import { JobGroupScreen } from "../job-group";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({ router: { back: jest.fn() } }));

beforeEach(() =>
  useOnboardingStore.setState({ userType: "worker", jobGroup: null }),
);

describe("JobGroupScreen", () => {
  it.each([
    ["worker", "어떤 일을 하고 계신가요?"],
    ["student", "어떤 직무를 희망하시나요?"],
    ["other", "어떤 일을 하고 계신가요?"],
  ] as const)("%s 유형이면 '%s'로 묻는다", async (userType, title) => {
    useOnboardingStore.setState({ userType });
    await render(<JobGroupScreen />);
    expect(screen.getByRole("header")).toHaveTextContent(title);
  });

  it("고르기 전에는 안내 문구를 보여주고 다음 버튼을 막는다", async () => {
    await render(<JobGroupScreen />);
    expect(screen.getByText("직군을 하나 골라 주세요")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "다음으로" })).toBeDisabled();
  });

  it("하나만 고를 수 있고, 다른 직군을 누르면 선택이 바뀐다", async () => {
    const user = userEvent.setup();
    await render(<JobGroupScreen />);

    await user.press(screen.getByRole("radio", { name: /IT개발·데이터/ }));
    await user.press(screen.getByRole("radio", { name: /디자인/ }));

    expect(useOnboardingStore.getState().jobGroup).toBe("design");
    expect(screen.getByText("1개 선택됨")).toBeOnTheScreen();
    expect(
      screen.getByRole("radio", { name: /IT개발·데이터/ }),
    ).not.toBeChecked();
    expect(screen.getByRole("button", { name: "다음으로" })).toBeEnabled();
  });
});
