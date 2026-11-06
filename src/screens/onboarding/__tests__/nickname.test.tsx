import { render, screen, userEvent } from "@testing-library/react-native";

import { NicknameScreen } from "../nickname";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({ router: { back: jest.fn() } }));

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
});
