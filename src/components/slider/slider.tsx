import { useState } from "react";
import { PanResponder, View } from "react-native";

import { cn } from "@/lib/cn";

const STEP_COUNT = 4;
const THUMB_SIZE = 24;

type SliderProps = {
  /** 0 ~ STEP_COUNT - 1 단계 */
  value: number;
  onValueChange: (value: number) => void;
  className?: string;
};

export function Slider({ value, onValueChange, className }: SliderProps) {
  const [width, setWidth] = useState(0);
  const range = Math.max(width - THUMB_SIZE, 0);
  const thumbLeft = (value / (STEP_COUNT - 1)) * range;

  const changeTo = (step: number) => {
    const next = Math.min(Math.max(step, 0), STEP_COUNT - 1);
    if (next !== value) onValueChange(next);
  };
  const moveTo = (x: number) => {
    if (range === 0) return;
    changeTo(Math.round(((x - THUMB_SIZE / 2) / range) * (STEP_COUNT - 1)));
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
      accessibilityValue={{ min: 0, max: STEP_COUNT - 1, now: value }}
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
