import { render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";

import type { TermsResponse } from "@/types/user/user.types";

import { TermsScreen } from "../terms";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({
  router: { dismissTo: jest.fn() },
  useFocusEffect: jest.fn(),
}));
jest.mock("expo-status-bar", () => ({ setStatusBarStyle: jest.fn() }));
jest.mock("expo-web-browser", () => ({ openBrowserAsync: jest.fn() }));

const TERMS: TermsResponse[] = [
  {
    termsId: 1,
    type: "SERVICE",
    title: "서비스 이용약관",
    version: "1.0",
    contentUrl: "https://terms.example/service",
    required: true,
  },
  {
    termsId: 2,
    type: "PRIVACY",
    title: "개인정보 처리방침",
    version: "1.0",
    contentUrl: "https://terms.example/privacy",
    required: true,
  },
];

const mockQuery = jest.fn();
jest.mock("@/hooks/queries/use-get-terms", () => ({
  useGetTerms: () => mockQuery(),
}));
const mockAgree = jest.fn(
  (_body: unknown, options?: { onSuccess?: () => void }) =>
    options?.onSuccess?.(),
);
jest.mock("@/hooks/mutations/use-agree-terms", () => ({
  useAgreeTerms: () => ({ mutate: mockAgree, isPending: false }),
}));

const next = () => screen.getByRole("button", { name: "다음으로" });

beforeEach(() => {
  jest.clearAllMocks();
  mockQuery.mockReturnValue({ data: TERMS, isPending: false });
});

describe("TermsScreen", () => {
  it("서버 약관과 [선택] 마케팅 항목을 Figma 문구로 보여준다", async () => {
    await render(<TermsScreen />);
    expect(screen.getByRole("header", { name: "반가워요!" })).toBeOnTheScreen();
    expect(screen.getByText("[필수] 이용약관 동의")).toBeOnTheScreen();
    expect(screen.getByText("[필수] 개인정보 처리방침 동의")).toBeOnTheScreen();
    expect(
      screen.getByText("[선택] 마케팅·이벤트 알림 수신"),
    ).toBeOnTheScreen();
  });

  it("필수 약관을 모두 체크해야 다음으로가 켜진다", async () => {
    const user = userEvent.setup();
    await render(<TermsScreen />);
    expect(next()).toBeDisabled();
    await user.press(
      screen.getByRole("checkbox", { name: "[필수] 이용약관 동의" }),
    );
    expect(next()).toBeDisabled();
    await user.press(
      screen.getByRole("checkbox", { name: "[필수] 개인정보 처리방침 동의" }),
    );
    expect(next()).toBeEnabled();
  });

  it("전체 동의는 모두 체크하고, 다시 누르면 모두 해제한다", async () => {
    const user = userEvent.setup();
    await render(<TermsScreen />);
    const all = screen.getByRole("checkbox", { name: "약관 전체 동의" });
    await user.press(all);
    for (const checkbox of screen.getAllByRole("checkbox")) {
      expect(checkbox).toBeChecked();
    }
    await user.press(all);
    for (const checkbox of screen.getAllByRole("checkbox")) {
      expect(checkbox).not.toBeChecked();
    }
  });

  it("다음으로는 서버 약관 동의만 저장하고 닉네임으로 넘어간다", async () => {
    const user = userEvent.setup();
    await render(<TermsScreen />);
    await user.press(screen.getByRole("checkbox", { name: "약관 전체 동의" }));
    await user.press(next());
    expect(mockAgree).toHaveBeenCalledWith(
      {
        agreements: [
          { termsId: 1, agreed: true },
          { termsId: 2, agreed: true },
        ],
      },
      expect.anything(),
    );
    expect(router.dismissTo).toHaveBeenCalledWith("/nickname");
  });

  it("보기를 누르면 약관 본문을 인앱 브라우저로 연다", async () => {
    const user = userEvent.setup();
    await render(<TermsScreen />);
    await user.press(
      screen.getByRole("link", { name: "[필수] 이용약관 동의 보기" }),
    );
    expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith(
      "https://terms.example/service",
    );
  });

  it("약관을 불러오는 동안에는 다음으로를 누를 수 없다", async () => {
    mockQuery.mockReturnValue({ data: undefined, isPending: true });
    await render(<TermsScreen />);
    expect(screen.queryByRole("checkbox")).toBeNull();
    expect(next()).toBeDisabled();
  });

  it("약관 조회에 실패하면 알리고, 다시 시도로 다시 받는다", async () => {
    const refetch = jest.fn();
    mockQuery.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      refetch,
    });
    const user = userEvent.setup();
    await render(<TermsScreen />);
    expect(screen.getByText("약관을 불러오지 못했어요")).toBeOnTheScreen();
    expect(next()).toBeDisabled();
    await user.press(screen.getByRole("button", { name: "다시 시도" }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
