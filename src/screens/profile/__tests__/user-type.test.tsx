import { render, screen, userEvent } from "@testing-library/react-native";

import { ProfileUserTypeScreen } from "../user-type";

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
const mockUpdateMe = jest.fn();
jest.mock("@/hooks/mutations/use-update-me", () => ({
  useUpdateMe: () => ({ mutate: mockUpdateMe, isPending: false }),
}));

beforeEach(() => jest.clearAllMocks());

describe("ProfileUserTypeScreen", () => {
  it("내 정보의 이동 유형을 선택해 둔다", async () => {
    await render(<ProfileUserTypeScreen />);
    expect(screen.getByRole("radio", { name: /직장인/ })).toBeChecked();
    expect(screen.getByRole("radio", { name: /학생/ })).not.toBeChecked();
  });

  it("다른 유형을 누르면 서버 코드로 바로 저장한다", async () => {
    const user = userEvent.setup();
    await render(<ProfileUserTypeScreen />);
    await user.press(screen.getByRole("radio", { name: /학생/ }));
    expect(mockUpdateMe).toHaveBeenCalledWith(
      { travelType: "STUDENT" },
      expect.anything(),
    );
  });
});
