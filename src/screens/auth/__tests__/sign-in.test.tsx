import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";
import { router } from "expo-router";

import { useOnboardingStore } from "@/stores/onboarding-store";
import { useToastStore } from "@/stores/toast-store";

import { SignInScreen } from "../sign-in";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({
  router: { replace: jest.fn() },
  useFocusEffect: jest.fn(),
}));

const mockGetKakaoToken = jest.fn();
const mockGetAppleToken = jest.fn();
let mockAppleAvailable = true;
jest.mock("@/lib/social-auth", () => ({
  getKakaoToken: () => mockGetKakaoToken(),
  getAppleToken: () => mockGetAppleToken(),
  isAppleLoginAvailable: () => Promise.resolve(mockAppleAvailable),
}));

let mockLoginResult = { onboardingCompleted: false };
const mockLogin = jest.fn(
  (_body: unknown, options?: { onSuccess?: (data: unknown) => void }) =>
    options?.onSuccess?.(mockLoginResult),
);
jest.mock("@/hooks/mutations/use-social-login", () => ({
  useSocialLogin: () => ({ mutate: mockLogin, isPending: false }),
}));

const kakaoButton = () =>
  screen.getByRole("button", { name: "카카오로 로그인하기" });

beforeEach(() => {
  jest.clearAllMocks();
  mockAppleAvailable = true;
  mockLoginResult = { onboardingCompleted: false };
  mockGetKakaoToken.mockResolvedValue("kakao-token");
  mockGetAppleToken.mockResolvedValue({
    token: "apple-id-token",
    authorizationCode: "apple-code",
  });
  useOnboardingStore.setState({ isOnboarded: false });
  useToastStore.getState().hideToast();
});

describe("SignInScreen", () => {
  it("카카오로 로그인하면 받은 토큰으로 서버에 로그인하고, 온보딩 전이면 닉네임으로 간다", async () => {
    const user = userEvent.setup();
    await render(<SignInScreen />);
    await user.press(kakaoButton());
    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith(
        { provider: "KAKAO", token: "kakao-token" },
        expect.anything(),
      ),
    );
    expect(router.replace).toHaveBeenCalledWith("/nickname");
  });

  it("Apple로 로그인하면 identity token과 authorization code를 함께 보낸다", async () => {
    const user = userEvent.setup();
    await render(<SignInScreen />);
    await user.press(
      await screen.findByRole("button", { name: "Apple로 로그인하기" }),
    );
    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith(
        {
          provider: "APPLE",
          token: "apple-id-token",
          authorizationCode: "apple-code",
        },
        expect.anything(),
      ),
    );
  });

  it("온보딩을 마친 회원이면 완료로 기록하고 홈으로 간다", async () => {
    mockLoginResult = { onboardingCompleted: true };
    const user = userEvent.setup();
    await render(<SignInScreen />);
    await user.press(kakaoButton());
    await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/"));
    expect(useOnboardingStore.getState().isOnboarded).toBe(true);
  });

  it("소셜 로그인 창을 닫으면 서버에 요청하지 않고 그대로 머문다", async () => {
    mockGetKakaoToken.mockResolvedValue(null);
    const user = userEvent.setup();
    await render(<SignInScreen />);
    await user.press(kakaoButton());
    await waitFor(() => expect(kakaoButton()).toBeEnabled());
    expect(mockLogin).not.toHaveBeenCalled();
    expect(router.replace).not.toHaveBeenCalled();
    expect(useToastStore.getState().toast).toBeNull();
  });

  it("소셜 SDK가 실패하면 토스트로 알린다", async () => {
    mockGetKakaoToken.mockRejectedValue(new Error("sdk"));
    const user = userEvent.setup();
    await render(<SignInScreen />);
    await user.press(kakaoButton());
    await waitFor(() =>
      expect(useToastStore.getState().toast?.message).toBe(
        "로그인하지 못했어요. 잠시 후 다시 시도해 주세요.",
      ),
    );
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("Apple 로그인을 쓸 수 없는 기기(Android)에서는 Apple 버튼을 숨긴다", async () => {
    mockAppleAvailable = false;
    await render(<SignInScreen />);
    expect(kakaoButton()).toBeOnTheScreen();
    expect(
      screen.queryByRole("button", { name: "Apple로 로그인하기" }),
    ).not.toBeOnTheScreen();
  });
});
