import { act, render, screen, userEvent } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useToastStore } from "@/stores/toast-store";

import { ToastHost } from "../toast-host";

const INITIAL_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const renderHost = () =>
  render(
    <SafeAreaProvider initialMetrics={INITIAL_METRICS}>
      <ToastHost />
    </SafeAreaProvider>,
  );
const { showToast } = useToastStore.getState();
const advance = (ms: number) => act(() => jest.advanceTimersByTime(ms));

describe("ToastHost", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useToastStore.getState().hideToast();
  });
  afterEach(() => jest.useRealTimers());

  it("showToast로 띄운 토스트는 2초 뒤 사라진다", async () => {
    await renderHost();
    await act(() => showToast({ message: "모두 읽음 처리했어요" }));
    expect(screen.getByText("모두 읽음 처리했어요")).toBeOnTheScreen();

    await advance(1999);
    expect(screen.getByText("모두 읽음 처리했어요")).toBeOnTheScreen();
    await advance(1);
    expect(screen.queryByText("모두 읽음 처리했어요")).toBeNull();
  });

  it("새 토스트가 오면 이전 것을 교체하고 2초를 다시 센다", async () => {
    await renderHost();
    await act(() => showToast({ message: "첫 번째" }));
    await advance(1500);
    await act(() => showToast({ message: "두 번째" }));

    expect(screen.queryByText("첫 번째")).toBeNull();
    await advance(1500);
    expect(screen.getByText("두 번째")).toBeOnTheScreen();
    await advance(500);
    expect(screen.queryByText("두 번째")).toBeNull();
  });

  it("라벨을 누르면 닫히고 onLabelPress를 호출한다", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onLabelPress = jest.fn();
    await renderHost();
    await act(() =>
      showToast({
        message: "보관함에 담았어요",
        label: "보러가기",
        onLabelPress,
      }),
    );

    await user.press(screen.getByRole("button", { name: "보러가기" }));

    expect(onLabelPress).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("보관함에 담았어요")).toBeNull();
  });
});
