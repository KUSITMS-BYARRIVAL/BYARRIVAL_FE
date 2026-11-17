import {
  fireEvent,
  render,
  screen,
  userEvent,
} from "@testing-library/react-native";

import { ProfileDepartureTimeScreen } from "../departure-time";

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
const mockReplaceWeekly = jest.fn();
let mockSaving = false;
jest.mock("@/hooks/mutations/use-replace-weekly-commute", () => ({
  useReplaceWeeklyCommute: () => ({
    mutate: mockReplaceWeekly,
    isPending: mockSaving,
  }),
}));

const increaseHour = () =>
  fireEvent(
    screen.getByRole("adjustable", { name: "시" }),
    "accessibilityAction",
    {
      nativeEvent: { actionName: "increment" },
    },
  );

beforeEach(() => {
  jest.clearAllMocks();
  mockSaving = false;
});

describe("ProfileDepartureTimeScreen", () => {
  it("요일별 출근 시각을 보여주고, 쉬는 날은 가장 이른 시각으로 흐리게 두어 누를 수 없다", async () => {
    await render(<ProfileDepartureTimeScreen />);
    expect(
      screen.getByRole("button", { name: "목 오후 01:00" }),
    ).toBeOnTheScreen();
    expect(
      screen.getByRole("button", { name: "토 오전 08:00" }),
    ).toBeDisabled();
  });

  it("요일 시각을 바꿔 확인하면 그 요일만 바꿔 저장한다", async () => {
    const user = userEvent.setup();
    await render(<ProfileDepartureTimeScreen />);
    await user.press(screen.getByRole("button", { name: "화 오전 09:00" }));
    await increaseHour();
    await user.press(screen.getByRole("button", { name: "확인" }));
    const days = mockReplaceWeekly.mock.calls[0]![0];
    expect(days).toContainEqual({
      dayOfWeek: "TUESDAY",
      startTime: "10:00",
      minutes: 30,
    });
    expect(days).toContainEqual({
      dayOfWeek: "MONDAY",
      startTime: "08:00",
      minutes: 30,
    });
  });

  it("기본은 가장 이른 시각이고, 바꾸면 이동하는 모든 요일을 그 시각으로 저장한다", async () => {
    const user = userEvent.setup();
    await render(<ProfileDepartureTimeScreen />);
    await user.press(screen.getByRole("button", { name: "기본 오전 08:00" }));
    await increaseHour();
    await user.press(screen.getByRole("button", { name: "확인" }));
    const days = mockReplaceWeekly.mock.calls[0]![0];
    expect(days).toHaveLength(5);
    expect(
      days.every(
        ({ startTime }: { startTime: string }) => startTime === "09:00",
      ),
    ).toBe(true);
  });

  it("앞 저장이 끝나기 전에는 다시 저장하지 않고 시트를 열어 둔다", async () => {
    mockSaving = true;
    const user = userEvent.setup();
    await render(<ProfileDepartureTimeScreen />);
    await user.press(screen.getByRole("button", { name: "화 오전 09:00" }));
    await increaseHour();
    await user.press(screen.getByRole("button", { name: "확인" }));
    expect(mockReplaceWeekly).not.toHaveBeenCalled();
    expect(screen.getByText("시간 설정")).toBeOnTheScreen();
  });
});
