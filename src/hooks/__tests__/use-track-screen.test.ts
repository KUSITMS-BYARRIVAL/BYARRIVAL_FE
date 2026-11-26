import { renderHook } from "@testing-library/react-native";
import { useGlobalSearchParams, usePathname } from "expo-router";

import { posthog } from "@/lib/analytics";

import { type ScreenGroup, useTrackScreen } from "../use-track-screen";

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

    await renderHook(() => useTrackScreen("app"));

    expect(screen).toHaveBeenCalledTimes(1);
    expect(screen).toHaveBeenCalledWith("route_stop");
  });

  it("표에 없는 경로는 경로 그대로 기록한다", async () => {
    setRoute("/unknown/page");

    await renderHook(() => useTrackScreen("app"));

    expect(screen).toHaveBeenCalledWith("/unknown/page");
  });

  it("보관함은 tab이 smalltalk이면 saved_smalltalk로 기록한다", async () => {
    setRoute("/archive", { tab: "smalltalk" });

    await renderHook(() => useTrackScreen("app"));

    expect(screen).toHaveBeenCalledWith("saved_smalltalk");
  });

  it("보관함은 tab이 없으면 saved_article로 기록한다", async () => {
    setRoute("/archive");

    await renderHook(() => useTrackScreen("app"));

    expect(screen).toHaveBeenCalledWith("saved_article");
  });

  it("열린 그룹이 정해지기 전(null)에는 기록하지 않는다", async () => {
    await renderHook(() => useTrackScreen(null));

    expect(screen).not.toHaveBeenCalled();
  });

  it("열린 그룹이 정해지면 그때 기록한다", async () => {
    const { rerender } = await renderHook(
      (group: ScreenGroup | null) => useTrackScreen(group),
      { initialProps: null as ScreenGroup | null },
    );

    await rerender("app");

    expect(screen).toHaveBeenCalledTimes(1);
    expect(screen).toHaveBeenCalledWith("home");
  });

  it("경로가 바뀌면 새 화면 이름으로 다시 기록한다", async () => {
    const { rerender } = await renderHook(() => useTrackScreen("app"));

    setRoute("/quiz");
    await rerender({});

    expect(screen).toHaveBeenNthCalledWith(1, "home");
    expect(screen).toHaveBeenNthCalledWith(2, "quiz");
  });

  it("같은 경로로 다시 렌더링하면 추가로 기록하지 않는다", async () => {
    const { rerender } = await renderHook(() => useTrackScreen("app"));

    await rerender({});

    expect(screen).toHaveBeenCalledTimes(1);
  });

  it("로그아웃 중 거쳐 가는 닫힌 그룹의 경로는 기록하지 않는다", async () => {
    // 가드가 (app)을 닫으면 이동 직전 경로가 그 그룹의 첫 화면 '/'로 잡힌다
    const { rerender } = await renderHook(() => useTrackScreen("auth"));

    setRoute("/intro");
    await rerender({});

    expect(screen).toHaveBeenCalledTimes(1);
    expect(screen).toHaveBeenCalledWith("onboarding_intro");
  });

  it("로그인 중 거쳐 가는 인트로 경로는 기록하지 않는다", async () => {
    setRoute("/intro");
    const { rerender } = await renderHook(() => useTrackScreen("app"));

    setRoute("/");
    await rerender({});

    expect(screen).toHaveBeenCalledTimes(1);
    expect(screen).toHaveBeenCalledWith("home");
  });

  it("표에 없는 경로는 열린 그룹과 상관없이 기록한다", async () => {
    setRoute("/unknown/page");

    await renderHook(() => useTrackScreen("auth"));

    expect(screen).toHaveBeenCalledWith("/unknown/page");
  });
});
