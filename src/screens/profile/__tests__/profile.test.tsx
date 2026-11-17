import { render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import { useDialogStore } from "@/stores/dialog-store";

import { ProfileScreen } from "../profile";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({
  router: { back: jest.fn(), push: jest.fn(), replace: jest.fn() },
}));
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
const mockLogout = jest.fn(
  (_: undefined, options?: { onSettled?: () => void }) =>
    options?.onSettled?.(),
);
jest.mock("@/hooks/mutations/use-logout", () => ({
  useLogout: () => ({ mutate: mockLogout }),
}));
const mockWithdraw = jest.fn(
  (_: undefined, options?: { onSuccess?: () => void }) =>
    options?.onSuccess?.(),
);
jest.mock("@/hooks/mutations/use-withdraw", () => ({
  useWithdraw: () => ({ mutate: mockWithdraw }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockMe = ME;
  useDialogStore.setState({ options: null, isVisible: false });
});

describe("ProfileScreen", () => {
  it("내 정보의 닉네임과 현재 설정 값을 목록에 보여준다", async () => {
    await render(<ProfileScreen />);
    expect(screen.getByText("출근러")).toBeOnTheScreen();
    expect(screen.getByText("직장인")).toBeOnTheScreen();
    expect(screen.getByText("IT개발·데이터")).toBeOnTheScreen();
    expect(screen.getByText("서울 강남구")).toBeOnTheScreen();
    expect(screen.getByText("경제·금융, 건강·생활")).toBeOnTheScreen();
  });

  it("내 정보를 불러오는 중이면 안내를 보여준다", async () => {
    mockMe = undefined;
    await render(<ProfileScreen />);
    expect(screen.getByText("내 정보를 불러오는 중이에요")).toBeOnTheScreen();
  });

  it("로그아웃은 확인한 뒤 실행하고 로그인 화면으로 간다", async () => {
    const user = userEvent.setup();
    await render(<ProfileScreen />);
    await user.press(screen.getByRole("button", { name: "로그아웃" }));
    expect(mockLogout).not.toHaveBeenCalled();
    expect(useDialogStore.getState().options?.title).toBe("로그아웃할까요?");

    useDialogStore.getState().options?.onConfirm();
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith("/sign-in");
  });

  it("회원 탈퇴는 확인한 뒤 실행하고 성공하면 로그인 화면으로 간다", async () => {
    const user = userEvent.setup();
    await render(<ProfileScreen />);
    await user.press(screen.getByRole("button", { name: "회원 탈퇴" }));
    expect(mockWithdraw).not.toHaveBeenCalled();

    useDialogStore.getState().options?.onConfirm();
    expect(mockWithdraw).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith("/sign-in");
  });
});
