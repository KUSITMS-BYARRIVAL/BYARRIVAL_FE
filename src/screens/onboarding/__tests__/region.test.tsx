import { render, screen, userEvent } from "@testing-library/react-native";

import { useOnboardingStore } from "@/stores/onboarding-store";

import { RegionScreen } from "../region";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({ router: { back: jest.fn() } }));

beforeEach(() =>
  useOnboardingStore.setState({ userType: "worker", region: null }),
);

describe("RegionScreen", () => {
  it.each([
    ["worker", "주로 어디서 근무하시나요?"],
    ["student", "주로 어디로 등교하시나요?"],
    ["other", "주로 어디로 이동하시나요?"],
  ] as const)("%s 유형이면 '%s'로 묻는다", async (userType, title) => {
    useOnboardingStore.setState({ userType });
    await render(<RegionScreen />);
    expect(screen.getByRole("header")).toHaveTextContent(title);
  });

  it("처음엔 서울 목록을 보여주고 다음 버튼을 막는다", async () => {
    await render(<RegionScreen />);
    expect(screen.getByRole("tab", { name: "서울" })).toBeSelected();
    expect(
      screen.getByRole("checkbox", { name: "서울전체" }),
    ).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "다음으로" })).toBeDisabled();
  });

  it("하나만 고를 수 있고, 고른 지역을 칩으로 보여준다", async () => {
    const user = userEvent.setup();
    await render(<RegionScreen />);

    await user.press(screen.getByRole("checkbox", { name: "강남구" }));
    await user.press(screen.getByRole("checkbox", { name: "강동구" }));

    expect(useOnboardingStore.getState().region).toEqual({
      province: "서울",
      district: "강동구",
    });
    expect(screen.getByRole("checkbox", { name: "강남구" })).not.toBeChecked();
    expect(screen.getByText("서울 강동구")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "다음으로" })).toBeEnabled();
  });

  it("시/도 전체를 고르면 칩에 시/도명만 보여준다", async () => {
    const user = userEvent.setup();
    await render(<RegionScreen />);
    await user.press(screen.getByRole("tab", { name: "경기" }));
    await user.press(screen.getByRole("checkbox", { name: "경기전체" }));
    expect(useOnboardingStore.getState().region).toEqual({
      province: "경기",
      district: null,
    });
    expect(screen.getByRole("button", { name: "경기" })).toBeOnTheScreen();
  });

  it("칩의 삭제를 누르면 선택이 풀리고 다음 버튼이 다시 막힌다", async () => {
    const user = userEvent.setup();
    useOnboardingStore.setState({
      region: { province: "서울", district: "강남구" },
    });
    await render(<RegionScreen />);
    await user.press(screen.getByRole("button", { name: "서울 강남구 삭제" }));
    expect(useOnboardingStore.getState().region).toBeNull();
    expect(screen.getByRole("button", { name: "다음으로" })).toBeDisabled();
  });

  it("검색 결과를 고르면 그 지역이 선택된다", async () => {
    const user = userEvent.setup();
    await render(<RegionScreen />);
    await user.type(screen.getByLabelText("지역명 검색"), "해운대");
    await user.press(screen.getByRole("button", { name: "부산 해운대구" }));
    expect(useOnboardingStore.getState().region).toEqual({
      province: "부산",
      district: "해운대구",
    });
    expect(screen.getByRole("tab", { name: "부산" })).toBeSelected();
  });

  it("검색 결과가 없으면 안내 문구를 보여준다", async () => {
    const user = userEvent.setup();
    await render(<RegionScreen />);
    await user.type(screen.getByLabelText("지역명 검색"), "뉴욕");
    expect(screen.getByText("검색 결과가 없어요")).toBeOnTheScreen();
  });
});
