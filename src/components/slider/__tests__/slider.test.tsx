import { fireEvent, render, screen } from "@testing-library/react-native";

import { Slider } from "../slider";

// 너비 324 → 손잡이(24) 중심이 12 ~ 312를 3칸(100px)으로 나눈다
async function renderSlider(value: number) {
  const onValueChange = jest.fn();
  await render(
    <Slider value={value} stepCount={4} onValueChange={onValueChange} />,
  );
  const slider = screen.getByRole("adjustable");
  await fireEvent(slider, "layout", {
    nativeEvent: { layout: { width: 324 } },
  });
  return { slider, onValueChange };
}

const touchAt = (locationX: number) => ({
  nativeEvent: { locationX },
  touchHistory: {
    numberActiveTouches: 1,
    indexOfSingleActiveTouch: 0,
    mostRecentTimeStamp: 0,
    touchBank: [
      {
        touchActive: true,
        startPageX: 0,
        startPageY: 0,
        startTimeStamp: 0,
        currentPageX: 0,
        currentPageY: 0,
        currentTimeStamp: 0,
        previousPageX: 0,
        previousPageY: 0,
        previousTimeStamp: 0,
      },
    ],
  },
});

describe("Slider", () => {
  it("트랙을 누르면 가장 가까운 단계로 바꾼다", async () => {
    const { slider, onValueChange } = await renderSlider(0);
    await fireEvent(slider, "responderGrant", touchAt(220));
    expect(onValueChange).toHaveBeenCalledWith(2);
  });

  it("트랙 밖을 눌러도 양 끝 단계를 넘지 않는다", async () => {
    const { slider, onValueChange } = await renderSlider(0);
    await fireEvent(slider, "responderGrant", touchAt(500));
    expect(onValueChange).toHaveBeenCalledWith(3);
  });

  it("같은 단계를 누르면 onValueChange를 호출하지 않는다", async () => {
    const { slider, onValueChange } = await renderSlider(1);
    await fireEvent(slider, "responderGrant", touchAt(110));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("접근성 조절 동작으로 한 단계씩 바꾸고 끝에서는 멈춘다", async () => {
    const { slider, onValueChange } = await renderSlider(3);
    await fireEvent(slider, "accessibilityAction", {
      nativeEvent: { actionName: "increment" },
    });
    expect(onValueChange).not.toHaveBeenCalled();
    await fireEvent(slider, "accessibilityAction", {
      nativeEvent: { actionName: "decrement" },
    });
    expect(onValueChange).toHaveBeenCalledWith(2);
  });

  it("stepCount에 맞춰 트랙을 나눈다", async () => {
    const onValueChange = jest.fn();
    await render(
      <Slider value={0} stepCount={3} onValueChange={onValueChange} />,
    );
    const slider = screen.getByRole("adjustable");
    await fireEvent(slider, "layout", {
      nativeEvent: { layout: { width: 324 } },
    });
    // 3단계면 12 ~ 312를 2칸(150px)으로 나눠 162가 가운데 단계다
    await fireEvent(slider, "responderGrant", touchAt(162));
    expect(onValueChange).toHaveBeenLastCalledWith(1);
    await fireEvent(slider, "responderGrant", touchAt(500));
    expect(onValueChange).toHaveBeenLastCalledWith(2);
  });

  it("stepCount가 1이면 손잡이를 시작점에 두고 단계를 바꾸지 않는다", async () => {
    const onValueChange = jest.fn();
    await render(
      <Slider value={0} stepCount={1} onValueChange={onValueChange} />,
    );
    const slider = screen.getByRole("adjustable");
    await fireEvent(slider, "layout", {
      nativeEvent: { layout: { width: 324 } },
    });
    await fireEvent(slider, "responderGrant", touchAt(500));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(slider).toHaveAccessibilityValue({ min: 0, max: 0, now: 0 });
  });

  it("넘긴 접근성 이름으로 찾을 수 있다", async () => {
    await render(
      <Slider
        value={0}
        stepCount={4}
        onValueChange={jest.fn()}
        accessibilityLabel="컨디션"
      />,
    );
    expect(
      screen.getByRole("adjustable", { name: "컨디션" }),
    ).toBeOnTheScreen();
  });
});
