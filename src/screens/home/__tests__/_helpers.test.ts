import { router } from "expo-router";

import type {
  RideProgress,
  Route,
  TodayRoute,
  TodayRouteState,
} from "@/types/ride/ride.types";

import { getRideButton } from "../_helpers";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

// 버튼은 노선 중 진행 정보(ride)만 본다
const todayRoute = (
  state: TodayRouteState,
  ride: Partial<RideProgress> | null = null,
): TodayRoute => ({
  state,
  route: { ride } as Route,
});

beforeEach(() => {
  jest.mocked(router.push).mockClear();
});

describe("getRideButton", () => {
  it("시작 전(NONE)이면 '뉴스 탑승 시작하기'를 누르면 컨디션 선택으로 간다", () => {
    const button = getRideButton({ state: "NONE", route: null });
    expect(button.label).toBe("뉴스 탑승 시작하기");
    button.onPress?.();
    expect(router.push).toHaveBeenCalledWith("/ride/condition");
  });

  it("탑승 상태를 못 받았으면(null) 시작 전으로 본다", () => {
    expect(getRideButton(null).label).toBe("뉴스 탑승 시작하기");
  });

  it("운행 중(IN_PROGRESS)이면 진행 정거장을 보여주고 정거장으로 이어서 간다", () => {
    const button = getRideButton(
      todayRoute("IN_PROGRESS", { currentStop: 3, totalStops: 5 }),
    );
    expect(button.label).toBe("이어서 탑승하기 (3/5)");
    button.onPress?.();
    expect(router.push).toHaveBeenCalledWith("/ride/stop");
  });

  it.each([
    ["CREATED", "/ride/select"],
    ["BOARDING", "/ride/boarding-pass"],
  ] as const)(
    "출발 전(%s)이면 '이어서 탑승하기'를 누르면 %s로 돌아간다",
    (state, pathname) => {
      const button = getRideButton(todayRoute(state));
      expect(button.label).toBe("이어서 탑승하기");
      button.onPress?.();
      expect(router.push).toHaveBeenCalledWith(pathname);
    },
  );

  it("완주(COMPLETED)면 '오늘 노선 다시 보기'를 누르면 도착 화면으로 간다", () => {
    const button = getRideButton(
      todayRoute("COMPLETED", { currentStop: 5, totalStops: 5 }),
    );
    expect(button.label).toBe("오늘 노선 다시 보기");
    button.onPress?.();
    expect(router.push).toHaveBeenCalledWith("/ride/arrival");
  });

  it.each(["EMPTY", "EXPIRED"] as const)(
    "%s면 '기사가 없어요!'를 보여주고 누를 동작이 없다",
    (state) => {
      const button = getRideButton({ state, route: null });
      expect(button.label).toBe("기사가 없어요!");
      expect(button.onPress).toBeUndefined();
    },
  );
});
