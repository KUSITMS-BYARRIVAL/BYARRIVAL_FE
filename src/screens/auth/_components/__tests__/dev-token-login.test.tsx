import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";

import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/toast-store";

import { DevTokenLogin } from "../dev-token-login";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));
const mockGetMe = jest.fn();
jest.mock("@/hooks/queries/use-get-me", () => ({
  getMeQuery: { queryKey: ["user", "getMe"], queryFn: () => mockGetMe() },
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockGetMe.mockResolvedValue({ onboardingCompleted: true });
  useAuthStore.setState({
    accessToken: null,
    refreshToken: null,
    isOnboarded: false,
  });
  useToastStore.getState().hideToast();
});

async function openSheet() {
  const user = userEvent.setup();
  await render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <DevTokenLogin />
    </QueryClientProvider>,
  );
  await user.press(screen.getByRole("button", { name: "개발용 토큰 로그인" }));
  return user;
}

describe("DevTokenLogin", () => {
  it("붙여넣은 토큰으로 내 정보를 받아 온보딩 완료 여부와 함께 세션을 시작한다", async () => {
    const user = await openSheet();
    await user.type(screen.getByLabelText("accessToken"), " access-1 ");
    await user.type(screen.getByLabelText("refreshToken"), "refresh-1");
    await user.press(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() =>
      expect(useAuthStore.getState()).toMatchObject({
        accessToken: "access-1",
        refreshToken: "refresh-1",
        isOnboarded: true,
      }),
    );
  });

  it("토큰 하나라도 비어 있으면 로그인하지 않는다", async () => {
    const user = await openSheet();
    await user.type(screen.getByLabelText("accessToken"), "access-1");
    await user.press(screen.getByRole("button", { name: "로그인" }));

    expect(mockGetMe).not.toHaveBeenCalled();
    expect(useAuthStore.getState().accessToken).toBeNull();
  });

  it("내 정보를 받지 못하면(만료된 토큰 등) 세션을 비우고 알린다", async () => {
    mockGetMe.mockRejectedValue(new Error("401"));
    const user = await openSheet();
    await user.type(screen.getByLabelText("accessToken"), "expired");
    await user.type(screen.getByLabelText("refreshToken"), "expired");
    await user.press(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() =>
      expect(useToastStore.getState().toast?.message).toBe(
        "토큰으로 로그인하지 못했어요",
      ),
    );
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});
