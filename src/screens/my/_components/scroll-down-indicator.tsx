import { useEffect, useState } from "react";
import { Animated, Easing } from "react-native";

import { ScrollDownArrowIcon } from "@/assets/icons";
import { cn } from "@/lib/cn";

// Figma 모션(2초 주기): 1.25초 동안 튀고 나머지는 멈춘다
const REST_MS = 750;

type ScrollDownIndicatorProps = {
  className?: string;
};

export function ScrollDownIndicator({ className }: ScrollDownIndicatorProps) {
  const [translateY] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const step = (
      toValue: number,
      duration: number,
      easing: (t: number) => number,
    ) =>
      Animated.timing(translateY, {
        toValue,
        duration,
        easing,
        useNativeDriver: true,
      });

    const animation = Animated.loop(
      Animated.sequence([
        step(-7, 220, Easing.inOut(Easing.ease)),
        step(8, 300, Easing.in(Easing.ease)),
        step(-6, 280, Easing.out(Easing.ease)),
        step(4, 220, Easing.out(Easing.ease)),
        step(0, 230, Easing.bezier(0.45, 1.45, 0.8, 1)),
        Animated.delay(REST_MS),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [translateY]);

  return (
    <Animated.View
      pointerEvents="none"
      className={cn("self-center", className)}
      style={{ transform: [{ translateY }] }}
    >
      <ScrollDownArrowIcon />
    </Animated.View>
  );
}
