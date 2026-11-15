import { View } from "react-native";

import { cn } from "@/lib/cn";

type ProgressStepperSmallProps = {
  total?: number;
  className?: string;
};

// Figma Progress Stepper Small/Default: 초록 배경 위 흰 선. 진행 단계 표시가 필요하면 ProgressStepper를 쓴다
export function ProgressStepperSmall({
  total = 7,
  className,
}: ProgressStepperSmallProps) {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      // 진행 단계 없이 전체 단계 수만 알린다
      accessibilityValue={{ min: 1, max: total }}
      className={cn("py-2.5", className)}
    >
      <View className="h-[3px] flex-row items-center justify-between rounded-full bg-white">
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            className="size-[11px] rounded-full border-2 border-white bg-green-100"
          />
        ))}
      </View>
    </View>
  );
}
