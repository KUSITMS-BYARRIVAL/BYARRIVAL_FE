import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { useOnboardingStore } from "@/stores/onboarding-store";

import { TravelTimeScreen } from "../travel-time";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({
  router: { back: jest.fn(), push: jest.fn() },
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

beforeEach(() =>
  useOnboardingStore.setState({ userType: "worker", travelMinutes: 30 }),
);

const slider = () => screen.getByRole("adjustable");
const adjust = (actionName: "increment" | "decrement") =>
  fireEvent(slider(), "accessibilityAction", { nativeEvent: { actionName } });

describe("TravelTimeScreen", () => {
  it.each([
    ["worker", "출퇴근 시간에"],
    ["student", "등하교 시간에"],
    ["other", "이동 시간에"],
  ] as const)("%s 유형이면 '%s'로 묻는다", async (userType, prefix) => {
    useOnboardingStore.setState({ userType });
    await render(<TravelTimeScreen />);
    expect(screen.getByRole("header").props.children).toContain(prefix);
  });

  it("다음을 누르면 고른 이동 시간을 저장하고 관심 분야로 넘어간다", async () => {
    await render(<TravelTimeScreen />);
    await adjust("increment");
    await fireEvent.press(screen.getByRole("button", { name: "다음으로" }));
    expect(mockUpdate).toHaveBeenLastCalledWith(
      { defaultCommuteMinutes: 40 },
      expect.anything(),
    );
    expect(router.push).toHaveBeenCalledWith("/interests");
  });

  it("기본값 30분을 보여주고, 30분 위로는 10분 단위로 늘린다", async () => {
    await render(<TravelTimeScreen />);
    expect(screen.getByText("30")).toBeOnTheScreen();
    await adjust("increment");
    expect(useOnboardingStore.getState().travelMinutes).toBe(40);
    expect(screen.getByText("40")).toBeOnTheScreen();
  });

  it("30분 아래로는 5분 단위로 줄인다", async () => {
    await render(<TravelTimeScreen />);
    await adjust("decrement");
    expect(useOnboardingStore.getState().travelMinutes).toBe(25);
  });

  it("30분 손잡이가 슬라이더 정가운데 있다", async () => {
    await render(<TravelTimeScreen />);
    expect(slider().props.accessibilityValue).toMatchObject({ now: 5 });
  });

  it.each([
    [5, "decrement"],
    [90, "increment"],
  ] as const)(
    "%i분에서 %s해도 범위 밖으로 움직이지 않는다",
    async (minutes, action) => {
      useOnboardingStore.setState({ travelMinutes: minutes });
      await render(<TravelTimeScreen />);
      await adjust(action);
      expect(useOnboardingStore.getState().travelMinutes).toBe(minutes);
    },
  );
});
