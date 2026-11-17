import { act, renderHook } from "@testing-library/react-native";

import { useDebouncedCallback } from "../use-debounced-callback";

// 가짜 타이머는 렌더 뒤에 켠다 (켠 채로 renderHook을 기다리면 effect가 반영되지 않는다)
afterEach(() => jest.useRealTimers());

describe("useDebouncedCallback", () => {
  it("delay가 지나기 전에는 콜백을 실행하지 않는다", async () => {
    const callback = jest.fn();
    const { result } = await renderHook(() =>
      useDebouncedCallback(callback, 300),
    );
    jest.useFakeTimers();

    result.current("a");
    await act(() => jest.advanceTimersByTime(299));

    expect(callback).not.toHaveBeenCalled();
  });

  it("연속 호출하면 마지막 값으로 한 번만 실행한다", async () => {
    const callback = jest.fn();
    const { result } = await renderHook(() =>
      useDebouncedCallback(callback, 300),
    );
    jest.useFakeTimers();

    result.current("a");
    result.current("b");
    result.current("c");
    await act(() => jest.advanceTimersByTime(300));

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("c");
  });

  it("대기 중에 언마운트하면 마지막 값을 바로 실행한다", async () => {
    const callback = jest.fn();
    const { result, unmount } = await renderHook(() =>
      useDebouncedCallback(callback, 300),
    );
    jest.useFakeTimers();

    result.current("a");
    await unmount();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("a");
  });

  it("대기 중인 값이 없으면 언마운트해도 실행하지 않는다", async () => {
    const callback = jest.fn();
    const { result, unmount } = await renderHook(() =>
      useDebouncedCallback(callback, 300),
    );
    jest.useFakeTimers();

    result.current("a");
    await act(() => jest.advanceTimersByTime(300));
    callback.mockClear();
    await unmount();

    expect(callback).not.toHaveBeenCalled();
  });

  it("리렌더로 바뀐 최신 콜백으로 실행한다", async () => {
    const first = jest.fn();
    const second = jest.fn();
    const { result, rerender } = await renderHook(
      ({ cb }: { cb: (value: string) => void }) =>
        useDebouncedCallback(cb, 300),
      { initialProps: { cb: first } },
    );
    jest.useFakeTimers();

    result.current("a");
    await rerender({ cb: second });
    await act(() => jest.advanceTimersByTime(300));

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith("a");
  });
});
