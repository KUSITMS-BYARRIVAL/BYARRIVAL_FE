import { View } from "react-native";

import { cn } from "@/lib/cn";

type ProgressBarProps = {
  /** 0 ~ 1 */
  progress: number;
  className?: string;
};

export function ProgressBar({ progress, className }: ProgressBarProps) {
  const percent = Math.round(Math.min(Math.max(progress, 0), 1) * 100);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      className={cn(
        "h-[6px] overflow-hidden rounded-full bg-icon-background",
        className,
      )}
    >
      {/* TODO: 진행률이 바뀔 때 채움 너비 애니메이션 추가 (추후 작업) */}
      <View
        className="h-full rounded-full bg-green-500"
        style={{ width: `${percent}%` }}
      />
    </View>
  );
}
