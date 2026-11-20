import { useEffect, useState } from "react";
import { Animated, Pressable, type PressableProps, View } from "react-native";

import { cn } from "@/lib/cn";

type ToggleProps = Omit<PressableProps, "children" | "onPress"> & {
  value: boolean;
  onValueChange: (value: boolean) => void;
  className?: string;
};

// 높이는 목록 줄 아이콘(24px)에 맞춘다 — 넘으면 줄 높이가 커진다
// 손잡이 이동 거리 = 트랙 40 - 손잡이 20 - 좌우 여백 2×2
const KNOB_TRAVEL = 16;

export function Toggle({
  value,
  onValueChange,
  className,
  accessibilityState,
  ...props
}: ToggleProps) {
  const [offset] = useState(() => new Animated.Value(value ? KNOB_TRAVEL : 0));

  useEffect(() => {
    Animated.timing(offset, {
      toValue: value ? KNOB_TRAVEL : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [offset, value]);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ ...accessibilityState, checked: value }}
      className={cn(
        "h-6 w-10 justify-center rounded-full px-0.5",
        value ? "bg-btn-brand" : "bg-btn-disabled",
        className,
      )}
      onPress={() => onValueChange(!value)}
      {...props}
    >
      <Animated.View style={{ transform: [{ translateX: offset }] }}>
        <View className="size-5 rounded-full bg-white" />
      </Animated.View>
    </Pressable>
  );
}
