import { render, screen, userEvent } from "@testing-library/react-native";

import { ProfileInterestsScreen } from "../interests";

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
jest.mock("@/hooks/queries/use-get-categories", () => ({
  useGetCategories: () => ({
    data: [
      "경제·금융",
      "건강·생활",
      "연예·문화",
      "정치·사회",
      "과학·환경",
      "IT·기술",
      "세계·국제",
      "스포츠",
    ].map((name, i) => ({ id: i + 1, name })),
    isError: false,
    refetch: jest.fn(),
  }),
}));
const mockReplace = jest.fn();
jest.mock("@/hooks/mutations/use-replace-interest-categories", () => ({
  useReplaceInterestCategories: () => ({
    mutate: mockReplace,
    isPending: false,
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockMe = ME;
});

describe("ProfileInterestsScreen", () => {
  it("8개 분야를 보여주고 내 관심 분야를 선택해 둔다", async () => {
    await render(<ProfileInterestsScreen />);
    expect(screen.getAllByRole("checkbox")).toHaveLength(8);
    expect(screen.getByRole("checkbox", { name: "경제·금융" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "건강·생활" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "스포츠" })).not.toBeChecked();
  });

  it("누르면 더하거나 뺀 목록을 카테고리 id로 바로 저장한다", async () => {
    const user = userEvent.setup();
    await render(<ProfileInterestsScreen />);
    await user.press(screen.getByRole("checkbox", { name: "스포츠" }));
    expect(mockReplace).toHaveBeenLastCalledWith([1, 2, 8]);
    await user.press(screen.getByRole("checkbox", { name: "경제·금융" }));
    expect(mockReplace).toHaveBeenLastCalledWith([2]);
  });

  it("마지막 하나는 선택된 채 비활성화되어 뺄 수 없다", async () => {
    mockMe = { ...ME, categoryIds: [8] };
    const user = userEvent.setup();
    await render(<ProfileInterestsScreen />);
    const sports = screen.getByRole("checkbox", { name: "스포츠" });
    expect(sports).toBeChecked();
    expect(sports).toBeDisabled();
    await user.press(sports);
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
