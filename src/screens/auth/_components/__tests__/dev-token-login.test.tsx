import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";
import { router } from "expo-router";

import { useAuthStore } from "@/stores/auth-store";

import { DevTokenLogin } from "../dev-token-login";

jest.mock("expo-router", () => ({ router: { replace: jest.fn() } }));
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

beforeEach(() => {
  jest.clearAllMocks();
  useAuthStore.setState({ accessToken: null, refreshToken: null });
});

async function openSheet() {
  const user = userEvent.setup();
  await render(<DevTokenLogin />);
  await user.press(screen.getByRole("button", { name: "개발용 토큰 로그인" }));
  return user;
}

describe("DevTokenLogin", () => {
  it("붙여넣은 토큰을 저장하고 온보딩으로 이동한다", async () => {
    const user = await openSheet();
    await user.type(screen.getByLabelText("accessToken"), " access-1 ");
    await user.type(screen.getByLabelText("refreshToken"), "refresh-1");
    await user.press(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() =>
      expect(router.replace).toHaveBeenCalledWith("/nickname"),
    );
    expect(useAuthStore.getState()).toMatchObject({
      accessToken: "access-1",
      refreshToken: "refresh-1",
    });
  });

  it("토큰 하나라도 비어 있으면 로그인하지 않는다", async () => {
    const user = await openSheet();
    await user.type(screen.getByLabelText("accessToken"), "access-1");
    await user.press(screen.getByRole("button", { name: "로그인" }));

    expect(router.replace).not.toHaveBeenCalled();
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});
