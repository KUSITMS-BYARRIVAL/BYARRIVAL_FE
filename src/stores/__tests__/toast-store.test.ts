import { useToastStore } from "../toast-store";

const { showToast, hideToast } = useToastStore.getState();
const currentMessage = () => useToastStore.getState().toast?.message;

describe("useToastStore", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    hideToast();
  });
  afterEach(() => jest.useRealTimers());

  it("showToast 후 2초가 지나면 토스트가 사라진다", () => {
    showToast({ message: "모두 읽음 처리했어요" });
    expect(currentMessage()).toBe("모두 읽음 처리했어요");

    jest.advanceTimersByTime(2000);
    expect(useToastStore.getState().toast).toBeNull();
  });

  it("hideToast를 호출하면 즉시 사라진다", () => {
    showToast({ message: "보관함에 담았어요" });
    hideToast();
    expect(useToastStore.getState().toast).toBeNull();
  });

  it("hideToast 뒤 새로 띄운 토스트는 이전 타이머 때문에 일찍 사라지지 않는다", () => {
    showToast({ message: "첫 번째" });
    jest.advanceTimersByTime(1500);
    hideToast();
    showToast({ message: "두 번째" });

    jest.advanceTimersByTime(500);
    expect(currentMessage()).toBe("두 번째");
    jest.advanceTimersByTime(1500);
    expect(useToastStore.getState().toast).toBeNull();
  });

  it("showToast를 연달아 호출하면 마지막 토스트 기준으로 2초 뒤 사라진다", () => {
    showToast({ message: "첫 번째" });
    jest.advanceTimersByTime(1500);
    showToast({ message: "두 번째" });

    jest.advanceTimersByTime(1999);
    expect(currentMessage()).toBe("두 번째");
    jest.advanceTimersByTime(1);
    expect(useToastStore.getState().toast).toBeNull();
  });
});
