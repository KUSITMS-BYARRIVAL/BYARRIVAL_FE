import { render, screen, userEvent } from "@testing-library/react-native";

import { ProfileRegionScreen } from "../region";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({ router: { back: jest.fn() } }));
const ME = {
  userId: 1,
  nickname: "출근러",
  profileImageUrl: null,
  termsAgreed: true,
  onboardingCompleted: true,
  travelType: "WORKER",
  defaultCommuteMinutes: 30,
  weeklyCommute: [
    { dayOfWeek: "MONDAY", startTime: "08:00", minutes: 30 },
    { dayOfWeek: "TUESDAY", startTime: "09:00", minutes: 30 },
    { dayOfWeek: "WEDNESDAY", startTime: "10:00", minutes: 30 },
    { dayOfWeek: "THURSDAY", startTime: "13:00", minutes: 40 },
    { dayOfWeek: "FRIDAY", startTime: "15:00", minutes: 50 },
  ],
  categoryIds: [1, 2],
  jobGroups: ["IT_DATA"],
  region: { sidoId: 1, sidoName: "서울", sigunguId: 11, sigunguName: "강남구" },
};
let mockMe: unknown = ME;
jest.mock("@/hooks/queries/use-get-me", () => ({
  useGetMe: () => ({
    data: mockMe,
    isPending: !mockMe,
    isError: false,
    refetch: jest.fn(),
  }),
}));
const mockChange = jest.fn();
jest.mock("@/hooks/mutations/use-change-region", () => ({
  useChangeRegion: () => ({ mutate: mockChange, isPending: false }),
}));
jest.mock("@/hooks/queries/use-get-regions", () => ({
  useGetRegions: () => ({
    data: [
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
    ],
    isPending: false,
    isError: false,
    refetch: jest.fn(),
  }),
}));

beforeEach(() => jest.clearAllMocks());

describe("ProfileRegionScreen", () => {
  it("내 근무 지역을 칩과 체크로 보여준다", async () => {
    await render(<ProfileRegionScreen />);
    expect(screen.getByText("서울 강남구")).toBeOnTheScreen();
    expect(screen.getByRole("tab", { name: "서울" })).toBeSelected();
    expect(screen.getByRole("checkbox", { name: "강남구" })).toBeChecked();
  });

  it("다른 시/군/구를 누르면 sigunguId로 바로 저장한다", async () => {
    const user = userEvent.setup();
    await render(<ProfileRegionScreen />);
    await user.press(screen.getByRole("checkbox", { name: "강동구" }));
    expect(mockChange).toHaveBeenCalledWith(12, expect.anything());
  });

  it("검색 결과를 고르면 그 지역으로 저장한다", async () => {
    const user = userEvent.setup();
    await render(<ProfileRegionScreen />);
    await user.type(screen.getByLabelText("지역명 검색"), "해운대");
    await user.press(screen.getByRole("button", { name: "부산 해운대구" }));
    expect(mockChange).toHaveBeenCalledWith(21, expect.anything());
  });
});
