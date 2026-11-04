import { View } from "react-native";

import { cn } from "@/lib/cn";

type ProgressBarProps = {
  /** 0 ~ 1 */
  progress: number;
  className?: string;
};

export function ProgressBar({ progress, className }: ProgressBarProps) {
  // 0/0 같은 계산에서 NaN이 들어오면 0%로 본다
  const safeProgress = Number.isFinite(progress) ? progress : 0;
  const percent = Math.round(Math.min(Math.max(safeProgress, 0), 1) * 100);

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
