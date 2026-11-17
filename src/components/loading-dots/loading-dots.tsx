import { useEffect, useState } from "react";
import { Animated, View } from "react-native";

import { cn } from "@/lib/cn";

const DOT_COUNT = 3;
const STEP_MS = 300;
const DIM_OPACITY = 0.3;

type LoadingDotsProps = {
  className?: string;
};

export function LoadingDots({ className }: LoadingDotsProps) {
  const [opacities] = useState(() =>
    Array.from({ length: DOT_COUNT }, () => new Animated.Value(DIM_OPACITY)),
  );

  useEffect(() => {
    const blink = (opacity: Animated.Value) =>
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: STEP_MS,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: DIM_OPACITY,
          duration: STEP_MS,
          useNativeDriver: true,
        }),
      ]);
    const animation = Animated.loop(
      Animated.stagger(STEP_MS, opacities.map(blink)),
    );
    animation.start();
    return () => animation.stop();
  }, [opacities]);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="불러오는 중"
      className={cn("flex-row items-center justify-center gap-2", className)}
    >
      {opacities.map((opacity, i) => (
        <Animated.View key={i} style={{ opacity }}>
          <View className="size-2.5 rounded-full bg-green-500" />
        </Animated.View>
      ))}
    </View>
  );
}
