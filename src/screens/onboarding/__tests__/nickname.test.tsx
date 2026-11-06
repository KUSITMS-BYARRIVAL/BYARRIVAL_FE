import { render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import { useOnboardingStore } from "@/stores/onboarding-store";

import { NicknameScreen } from "../nickname";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({
  router: { back: jest.fn(), push: jest.fn() },
}));

beforeEach(() => useOnboardingStore.setState({ nickname: "", userType: null }));

const nextButton = () => screen.getByRole("button", { name: "다음으로" });

async function typeNickname(text: string) {
  const user = userEvent.setup();
  await render(<NicknameScreen />);
  await user.type(screen.getByLabelText("닉네임"), text);
}

describe("NicknameScreen", () => {
  it("입력 전에는 기본 닉네임으로 미리보고 다음 버튼이 비활성이다", async () => {
    await render(<NicknameScreen />);
    expect(screen.getByText("출근러님,")).toBeOnTheScreen();
    expect(nextButton()).toBeDisabled();
  });

  it("입력한 닉네임을 미리보기에 바로 반영하고 다음 버튼을 활성화한다", async () => {
    await typeNickname("아침형");
    expect(screen.getByText("아침형님,")).toBeOnTheScreen();
    expect(nextButton()).toBeEnabled();
  });

  it("1자면 2자 이상 입력하라고 안내한다", async () => {
    await typeNickname("김");
    expect(screen.getByText("2자 이상 입력해주세요")).toBeOnTheScreen();
    expect(nextButton()).toBeDisabled();
  });

  it("특수문자가 있으면 한글·영문·숫자만 쓸 수 있다고 안내한다", async () => {
    await typeNickname("출근러!");
    expect(
      screen.getByText("한글, 영문, 숫자만 쓸 수 있어요"),
    ).toBeOnTheScreen();
    expect(nextButton()).toBeDisabled();
  });

  it("공백만 입력하면 다음으로 넘어갈 수 없다", async () => {
    await typeNickname("   ");
    expect(nextButton()).toBeDisabled();
  });

  it("다음을 누르면 닉네임을 저장하고 유형 선택으로 넘어간다", async () => {
    const user = userEvent.setup();
    await render(<NicknameScreen />);
    await user.type(screen.getByLabelText("닉네임"), " 아침형 ");
    await user.press(nextButton());
    expect(useOnboardingStore.getState().nickname).toBe("아침형");
    expect(router.push).toHaveBeenCalledWith("/user-type");
  });

  it("다음을 누르기 전에 화면을 떠났다 돌아와도 입력하던 닉네임이 남는다", async () => {
    const user = userEvent.setup();
    const { unmount } = await render(<NicknameScreen />);
    await user.type(screen.getByLabelText("닉네임"), "초안");
    await unmount();

    await render(<NicknameScreen />);
    expect(screen.getByLabelText("닉네임")).toHaveDisplayValue("초안");
  });

  it("저장된 닉네임이 있으면 그 값으로 시작한다", async () => {
    useOnboardingStore.setState({ nickname: "출근요정" });
    await render(<NicknameScreen />);
    expect(screen.getByDisplayValue("출근요정")).toBeOnTheScreen();
  });
});
