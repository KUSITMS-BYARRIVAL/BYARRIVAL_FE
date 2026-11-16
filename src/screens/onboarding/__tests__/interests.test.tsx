import { render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import { useOnboardingStore } from "@/stores/onboarding-store";

import { InterestsScreen } from "../interests";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({
  router: { back: jest.fn(), push: jest.fn() },
}));
jest.mock("@/hooks/queries/use-get-categories", () => ({
  useGetCategories: () => ({
    data: [
      { id: 1, name: "경제·금융" },
      { id: 6, name: "IT·기술" },
    ],
  }),
}));

const mockUpdate = jest.fn(
  (_body: unknown, options?: { onSuccess?: () => void }) =>
    options?.onSuccess?.(),
);
jest.mock("@/hooks/mutations/use-update-onboarding", () => ({
  useUpdateOnboarding: () => ({
    mutate: mockUpdate,
    isPending: false,
    error: null,
    reset: jest.fn(),
  }),
}));

beforeEach(() => useOnboardingStore.setState({ interests: [] }));

describe("InterestsScreen", () => {
  it("아무것도 고르지 않으면 안내 문구를 보여주고 다음 버튼을 막는다", async () => {
    await render(<InterestsScreen />);
    expect(screen.getByText("1개 이상 골라주세요")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "다음으로" })).toBeDisabled();
  });

  it("분야를 고르면 개수를 세고, 다시 누르면 해제한다", async () => {
    const user = userEvent.setup();
    await render(<InterestsScreen />);

    await user.press(screen.getByRole("checkbox", { name: /경제/ }));
    await user.press(screen.getByRole("checkbox", { name: /IT·기술/ }));
    expect(screen.getByText("2개 선택됨")).toBeOnTheScreen();
    expect(screen.getByRole("checkbox", { name: /경제/ })).toBeChecked();
    expect(screen.getByRole("button", { name: "다음으로" })).toBeEnabled();

    await user.press(screen.getByRole("checkbox", { name: /경제/ }));
    expect(useOnboardingStore.getState().interests).toEqual(["tech"]);
  });

  it("다음을 누르면 고른 분야를 서버 카테고리 id로 저장하고 직군으로 넘어간다", async () => {
    const user = userEvent.setup();
    await render(<InterestsScreen />);
    await user.press(screen.getByRole("checkbox", { name: /IT·기술/ }));
    await user.press(screen.getByRole("checkbox", { name: /경제/ }));
    await user.press(screen.getByRole("button", { name: "다음으로" }));
    expect(mockUpdate).toHaveBeenLastCalledWith(
      { categoryIds: [6, 1] },
      expect.anything(),
    );
    expect(router.push).toHaveBeenCalledWith("/job-group");
  });
});
