import { render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import { useOnboardingStore } from "@/stores/onboarding-store";

import { RegionScreen } from "../region";

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
  useUpdateOnboarding: () => ({ mutate: mockUpdate, isPending: false }),
}));

const SIDOS = [
  {
    sidoId: 1,
    name: "서울",
    fullName: "서울특별시",
    sigungus: [
      { sigunguId: 11, name: "강남구" },
      { sigunguId: 12, name: "강동구" },
    ],
  },
  {
    sidoId: 2,
    name: "부산",
    fullName: "부산광역시",
    sigungus: [{ sigunguId: 21, name: "해운대구" }],
  },
];
const mockRefetch = jest.fn();
let mockRegions: {
  data?: typeof SIDOS;
  isPending: boolean;
  isError: boolean;
  refetch: jest.Mock;
};
jest.mock("@/hooks/queries/use-get-regions", () => ({
  useGetRegions: () => mockRegions,
}));

const GANGNAM = {
  sidoId: 1,
  sidoName: "서울",
  sigunguId: 11,
  sigunguName: "강남구",
};
const HAEUNDAE = {
  sidoId: 2,
  sidoName: "부산",
  sigunguId: 21,
  sigunguName: "해운대구",
};

beforeEach(() => {
  jest.clearAllMocks();
  mockRegions = {
    data: SIDOS,
    isPending: false,
    isError: false,
    refetch: mockRefetch,
  };
  useOnboardingStore.setState({ userType: "worker", region: null });
});

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

  it("처음엔 서버 목록의 첫 시/도를 보여주고 다음 버튼을 막는다", async () => {
    await render(<RegionScreen />);
    expect(screen.getByRole("tab", { name: "서울" })).toBeSelected();
    expect(screen.getByRole("checkbox", { name: "강남구" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "다음으로" })).toBeDisabled();
  });

  it("목록을 불러오는 중이면 안내 문구를 보여준다", async () => {
    mockRegions = { ...mockRegions, data: undefined, isPending: true };
    await render(<RegionScreen />);
    expect(screen.getByText("지역 목록을 불러오는 중이에요")).toBeOnTheScreen();
  });

  it("목록을 불러오지 못하면 다시 시도할 수 있다", async () => {
    const user = userEvent.setup();
    mockRegions = { ...mockRegions, data: undefined, isError: true };
    await render(<RegionScreen />);
    await user.press(screen.getByRole("button", { name: "다시 시도" }));
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("하나만 고를 수 있고, 고른 지역을 칩으로 보여준다", async () => {
    const user = userEvent.setup();
    await render(<RegionScreen />);

    await user.press(screen.getByRole("checkbox", { name: "강남구" }));
    await user.press(screen.getByRole("checkbox", { name: "강동구" }));

    expect(useOnboardingStore.getState().region).toEqual({
      sidoId: 1,
      sidoName: "서울",
      sigunguId: 12,
      sigunguName: "강동구",
    });
    expect(screen.getByRole("checkbox", { name: "강남구" })).not.toBeChecked();
    expect(screen.getByText("서울 강동구")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "다음으로" })).toBeEnabled();
  });

  it("다음을 누르면 sigunguId로 저장하고 완료 화면으로 넘어간다", async () => {
    const user = userEvent.setup();
    useOnboardingStore.setState({ region: GANGNAM });
    await render(<RegionScreen />);
    await user.press(screen.getByRole("button", { name: "다음으로" }));
    expect(mockUpdate).toHaveBeenLastCalledWith(
      { sigunguId: 11 },
      expect.anything(),
    );
    expect(router.push).toHaveBeenCalledWith("/complete");
  });

  it("칩의 삭제를 누르면 선택이 풀리고 다음 버튼이 다시 막힌다", async () => {
    const user = userEvent.setup();
    useOnboardingStore.setState({ region: GANGNAM });
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
    expect(useOnboardingStore.getState().region).toEqual(HAEUNDAE);
    expect(screen.getByRole("tab", { name: "부산" })).toBeSelected();
  });

  it("검색 중에 지역 칩을 누르면 검색어를 비우고 그 지역 목록을 보여준다", async () => {
    const user = userEvent.setup();
    useOnboardingStore.setState({ region: HAEUNDAE });
    await render(<RegionScreen />);
    await user.type(screen.getByLabelText("지역명 검색"), "강남");
    await user.press(screen.getByRole("button", { name: "부산 해운대구" }));

    expect(screen.getByLabelText("지역명 검색")).toHaveDisplayValue("");
    expect(screen.getByRole("tab", { name: "부산" })).toBeSelected();
    expect(screen.getByRole("checkbox", { name: "해운대구" })).toBeChecked();
  });

  it("검색 결과가 없으면 안내 문구를 보여준다", async () => {
    const user = userEvent.setup();
    await render(<RegionScreen />);
    await user.type(screen.getByLabelText("지역명 검색"), "뉴욕");
    expect(screen.getByText("검색 결과가 없어요")).toBeOnTheScreen();
  });
});
