import { Pressable, Text, View } from "react-native";

import { MinusIcon, PlusIcon } from "@/assets/icons";
import { cn } from "@/lib/cn";
import { SEMANTIC } from "@/theme/colors";

type NumberStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** 스크린리더가 읽을 이름 (예: 월요일 출근 시간) */
  accessibilityLabel?: string;
  className?: string;
};

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  accessibilityLabel,
  className,
}: NumberStepperProps) {
  const canDecrease = value - step >= min;
  const canIncrease = value + step <= max;

  const changeBy = (delta: number) => {
    const next = Math.min(Math.max(value + delta, min), max);
    if (next !== value) onChange(next);
  };

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: String(value) }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(e) =>
        changeBy(e.nativeEvent.actionName === "increment" ? step : -step)
      }
      className={cn(
        "flex-row items-center gap-1 rounded-md bg-card-pressed p-1",
        className,
      )}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="줄이기"
        disabled={!canDecrease}
        hitSlop={6}
        className="size-7 items-center justify-center"
        onPress={() => changeBy(-step)}
      >
        <MinusIcon
          color={
            canDecrease
              ? SEMANTIC.icon.secondary
              : SEMANTIC.icon["on-fill-muted"]
          }
        />
      </Pressable>
      <View className="items-center justify-center rounded-md bg-white px-3 py-1.5">
        {/* 두 자리 숫자까지 너비가 바뀌지 않도록 Figma처럼 24px 이상으로 둔다 */}
        <Text className="min-w-6 text-center text-strong text-label2-sb">
          {value}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="늘리기"
        disabled={!canIncrease}
        hitSlop={6}
        className="size-7 items-center justify-center"
        onPress={() => changeBy(step)}
      >
        <PlusIcon
          color={
            canIncrease
              ? SEMANTIC.icon.secondary
              : SEMANTIC.icon["on-fill-muted"]
          }
        />
      </Pressable>
    </View>
  );
}
