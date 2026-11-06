import { fireEvent, render, screen } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { MySummaryHero } from "../my-summary-hero";

const INITIAL_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const renderHero = (
  props: Partial<React.ComponentProps<typeof MySummaryHero>> = {},
) =>
  render(
    <SafeAreaProvider initialMetrics={INITIAL_METRICS}>
      <MySummaryHero
        totalHours={142}
        monthMinutes={92}
        readCount={37}
        onPressProfile={jest.fn()}
        {...props}
      />
    </SafeAreaProvider>,
  );

describe("MySummaryHero", () => {
  it("총 누적 시간을 배지로 표시한다", async () => {
    await renderHero();
    expect(screen.getByText("총 142 H")).toBeOnTheScreen();
  });

  it("이번 달 분을 시간과 분으로 나눠 표시한다", async () => {
    await renderHero({ monthMinutes: 92 });
    expect(screen.getByText(/1시간 32분을/)).toBeOnTheScreen();
  });

  it("분이 0이면 0분으로 표시한다", async () => {
    await renderHero({ monthMinutes: 120 });
    expect(screen.getByText(/2시간 0분을/)).toBeOnTheScreen();
  });

  it("한 시간 미만이면 0시간으로 표시한다", async () => {
    await renderHero({ monthMinutes: 45 });
    expect(screen.getByText(/0시간 45분을/)).toBeOnTheScreen();
  });

  it("읽은 기사 수를 이야기 개수 문구에 표시한다", async () => {
    await renderHero({ readCount: 37 });
    expect(screen.getByText(/37개의 이야기로 채워졌어요/)).toBeOnTheScreen();
  });

  it("프로필 버튼을 누르면 onPressProfile을 호출한다", async () => {
    const onPressProfile = jest.fn();
    await renderHero({ onPressProfile });
    await fireEvent.press(screen.getByLabelText("프로필"));
    expect(onPressProfile).toHaveBeenCalledTimes(1);
  });
});
