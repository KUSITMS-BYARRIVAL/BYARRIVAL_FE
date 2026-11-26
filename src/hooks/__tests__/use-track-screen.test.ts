import { renderHook } from "@testing-library/react-native";
import { useGlobalSearchParams, usePathname } from "expo-router";

import { posthog } from "@/lib/analytics";

import { useTrackScreen } from "../use-track-screen";

jest.mock("expo-router", () => ({
  usePathname: jest.fn(),
  useGlobalSearchParams: jest.fn(),
}));

const screen = jest.mocked(posthog.screen);

const setRoute = (pathname: string, params: { tab?: string } = {}) => {
  jest.mocked(usePathname).mockReturnValue(pathname);
  jest.mocked(useGlobalSearchParams).mockReturnValue(params);
};

beforeEach(() => {
  jest.clearAllMocks();
  setRoute("/");
});

describe("useTrackScreen", () => {
  it("표에 있는 경로는 표의 화면 이름으로 기록한다", async () => {
    setRoute("/ride/stop");

    await renderHook(() => useTrackScreen(true));

    expect(screen).toHaveBeenCalledTimes(1);
    expect(screen).toHaveBeenCalledWith("route_stop");
  });

  it("표에 없는 경로는 경로 그대로 기록한다", async () => {
    setRoute("/unknown/page");

    await renderHook(() => useTrackScreen(true));

    expect(screen).toHaveBeenCalledWith("/unknown/page");
  });

  it("보관함은 tab이 smalltalk이면 saved_smalltalk로 기록한다", async () => {
    setRoute("/archive", { tab: "smalltalk" });

    await renderHook(() => useTrackScreen(true));

    expect(screen).toHaveBeenCalledWith("saved_smalltalk");
  });

  it("보관함은 tab이 없으면 saved_article로 기록한다", async () => {
    setRoute("/archive");

    await renderHook(() => useTrackScreen(true));

    expect(screen).toHaveBeenCalledWith("saved_article");
  });

  it("isEnabled가 false인 동안에는 기록하지 않는다", async () => {
    await renderHook(() => useTrackScreen(false));

    expect(screen).not.toHaveBeenCalled();
  });

  it("isEnabled가 true로 바뀌면 그때 기록한다", async () => {
    const { rerender } = await renderHook(
      (enabled: boolean) => useTrackScreen(enabled),
      { initialProps: false },
    );

    await rerender(true);

    expect(screen).toHaveBeenCalledTimes(1);
    expect(screen).toHaveBeenCalledWith("home");
  });

  it("경로가 바뀌면 새 화면 이름으로 다시 기록한다", async () => {
    const { rerender } = await renderHook(() => useTrackScreen(true));

    setRoute("/quiz");
    await rerender({});

    expect(screen).toHaveBeenNthCalledWith(1, "home");
    expect(screen).toHaveBeenNthCalledWith(2, "quiz");
  });

  it("같은 경로로 다시 렌더링하면 추가로 기록하지 않는다", async () => {
    const { rerender } = await renderHook(() => useTrackScreen(true));

    await rerender({});

    expect(screen).toHaveBeenCalledTimes(1);
  });
});
