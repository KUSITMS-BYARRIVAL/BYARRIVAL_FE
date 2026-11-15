import { Pressable, Text, View } from "react-native";

import type { Time } from "@/components/time-picker/time-picker";
import { cn } from "@/lib/cn";

// TimePicker와 같은 12시간제 (0시·12시는 12)
function toLabel({ hour, minute }: Time) {
  return {
    period: hour < 12 ? "오전" : "오후",
    clock: `${String(hour % 12 || 12).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
  };
}

type TimeSettingRowProps = {
  /** 왼쪽 라벨 (예: 요일) */
  label: string;
  time: Time;
  /** 쉬는 날처럼 시간을 쓰지 않으면 흐리게(20%) 보이고 누를 수 없다 */
  disabled?: boolean;
  /** 시간 칸을 누르면 TimePicker 등을 띄우도록 사용처에서 넘긴다 */
  onPress?: () => void;
  className?: string;
};

// Figma .primitive / Time
export function TimeSettingRow({
  label,
  time,
  disabled = false,
  onPress,
  className,
}: TimeSettingRowProps) {
  const { period, clock } = toLabel(time);

  return (
    <View
      className={cn(
        "h-10 flex-row items-center justify-between",
        disabled && "opacity-20",
        className,
      )}
    >
      <Text className="text-primary text-title2-sb">{label}</Text>
      <View className="h-full flex-row items-center gap-2">
        <Text className="text-tertiary text-caption1-m">{period}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label} ${period} ${clock}`}
          accessibilityState={{ disabled }}
          disabled={disabled || !onPress}
          onPress={onPress}
          className="h-full w-20 items-center justify-center rounded-sm bg-card-pressed px-3 py-2"
        >
          <Text className="text-primary text-title2-sb">{clock}</Text>
        </Pressable>
      </View>
    </View>
  );
}
