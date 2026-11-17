import { act, render, screen, userEvent } from "@testing-library/react-native";

import { useToastStore } from "@/stores/toast-store";

import { ProfileTravelTimeScreen } from "../travel-time";

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
const mockReplaceWeekly = jest.fn();
jest.mock("@/hooks/mutations/use-replace-weekly-commute", () => ({
  useReplaceWeeklyCommute: () => ({
    mutate: mockReplaceWeekly,
    isPending: false,
  }),
}));

const increase = () => screen.getAllByRole("button", { name: "늘리기" });
const decrease = () => screen.getAllByRole("button", { name: "줄이기" });
const wait = () => act(() => jest.advanceTimersByTime(600));

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  mockMe = ME;
  useToastStore.getState().hideToast();
});
afterEach(() => jest.useRealTimers());

describe("ProfileTravelTimeScreen", () => {
  it("요일별 이동 시간을 보여주고, 서버에 없는 요일은 쉬는 날로 표시한다", async () => {
    await render(<ProfileTravelTimeScreen />);
    expect(screen.getByText("약 40분")).toBeOnTheScreen();
    expect(screen.getAllByText("쉬는 날")).toHaveLength(2);
  });

  it("요일을 바꾸면 멈춘 뒤 한 번만 요일별 설정을 저장한다", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await render(<ProfileTravelTimeScreen />);
    // 0: 기본, 1: 월
    await user.press(increase()[1]!);
    await user.press(increase()[1]!);
    expect(mockReplaceWeekly).not.toHaveBeenCalled();
    await wait();
    expect(mockReplaceWeekly).toHaveBeenCalledTimes(1);
    expect(mockReplaceWeekly.mock.calls[0]![0][0]).toEqual({
      dayOfWeek: "MONDAY",
      startTime: "08:00",
      minutes: 40,
    });
    expect(mockUpdateMe).not.toHaveBeenCalled();
  });

  it("쉬는 날을 이동하는 날로 바꾸면 가장 이른 출근 시각으로 채워 저장한다", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await render(<ProfileTravelTimeScreen />);
    // 6: 토
    await user.press(increase()[6]!);
    await wait();
    expect(mockReplaceWeekly.mock.calls[0]![0]).toContainEqual({
      dayOfWeek: "SATURDAY",
      startTime: "08:00",
      minutes: 5,
    });
  });

  it("기본 이동 시간은 내 정보 수정으로 저장한다", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await render(<ProfileTravelTimeScreen />);
    await user.press(increase()[0]!);
    await wait();
    expect(mockUpdateMe).toHaveBeenCalledWith({ defaultCommuteMinutes: 35 });
  });

  it("모든 요일을 쉬는 날로 만들면 저장하지 않고 알린다", async () => {
    mockMe = {
      ...ME,
      weeklyCommute: [{ dayOfWeek: "MONDAY", startTime: "08:00", minutes: 5 }],
    };
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await render(<ProfileTravelTimeScreen />);
    await user.press(decrease()[1]!);
    await wait();
    expect(mockReplaceWeekly).not.toHaveBeenCalled();
    expect(useToastStore.getState().toast?.message).toBe(
      "이동하는 요일이 하루 이상 있어야 저장돼요",
    );
  });
});
