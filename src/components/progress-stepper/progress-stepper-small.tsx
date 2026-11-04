import { View } from "react-native";

import { cn } from "@/lib/cn";

type ProgressStepperSmallProps = {
  total?: number;
  /** brand에서 채워 표시할 단계 (1부터). default 톤은 모두 비어 있다 */
  current?: number;
  /** default는 초록 배경 위 흰 선, brand는 흰 배경 위 초록 선 */
  tone?: "default" | "brand";
  className?: string;
};

export function ProgressStepperSmall({
  total = 7,
  current = 1,
  tone = "default",
  className,
}: ProgressStepperSmallProps) {
  const brand = tone === "brand";

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={
        brand ? { min: 1, max: total, now: current } : undefined
      }
      className={cn("py-2.5", className)}
    >
      <View
        className={cn(
          "h-[3px] flex-row items-center justify-between rounded-full",
          brand ? "bg-green-500" : "bg-white",
        )}
      >
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            className={cn(
              "size-[11px] rounded-full border-2",
              brand ? "border-green-500" : "border-white",
              brand && i < current ? "bg-green-500" : "bg-green-100",
            )}
          />
        ))}
      </View>
    </View>
  );
}
