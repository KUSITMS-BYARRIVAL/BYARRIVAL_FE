import { useState } from "react";
import { PanResponder, View } from "react-native";

import { cn } from "@/lib/cn";

const THUMB_SIZE = 24;

type SliderProps = {
  /** 0 ~ stepCount - 1 단계 */
  value: number;
  stepCount: number;
  onValueChange: (value: number) => void;
  accessibilityLabel?: string;
  className?: string;
};

export function Slider({
  value,
  stepCount,
  onValueChange,
  accessibilityLabel,
  className,
}: SliderProps) {
  const [width, setWidth] = useState(0);
  const range = Math.max(width - THUMB_SIZE, 0);
  // stepCount가 1 이하면 0으로 나눠 위치가 NaN이 되므로 단계 하나로 취급한다
  const lastStep = Math.max(stepCount - 1, 0);
  const thumbLeft = lastStep === 0 ? 0 : (value / lastStep) * range;

  const changeTo = (step: number) => {
    const next = Math.min(Math.max(step, 0), lastStep);
    if (next !== value) onValueChange(next);
  };
  const moveTo = (x: number) => {
    if (range === 0) return;
    changeTo(Math.round(((x - THUMB_SIZE / 2) / range) * lastStep));
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    // ScrollView 안에서도 드래그 중에 스크롤로 넘어가지 않게 한다
    onPanResponderTerminationRequest: () => false,
    // 자식은 pointer-events-none이라 locationX는 항상 트랙 기준이다
    onPanResponderGrant: (e) => moveTo(e.nativeEvent.locationX),
    onPanResponderMove: (e) => moveTo(e.nativeEvent.locationX),
  });

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: lastStep, now: value }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(e) =>
        changeTo(value + (e.nativeEvent.actionName === "increment" ? 1 : -1))
      }
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      hitSlop={{ top: 10, bottom: 10 }}
      className={cn("h-[24px] justify-center", className)}
      {...panResponder.panHandlers}
    >
      <View className="pointer-events-none h-[6px] rounded-sm bg-grey-200">
        <View
          className="h-full rounded-sm bg-green-500"
          style={{ width: thumbLeft + THUMB_SIZE }}
        />
      </View>
      <View
        className="pointer-events-none absolute size-[24px] rounded-full border border-grey-200 bg-white"
        style={{ left: thumbLeft }}
      />
    </View>
  );
}
