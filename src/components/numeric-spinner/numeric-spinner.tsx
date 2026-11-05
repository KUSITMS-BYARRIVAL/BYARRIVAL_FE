import { Text, View } from "react-native";

import { cn } from "@/lib/cn";

import { NumberStepper } from "./number-stepper";

type NumericSpinnerProps = {
  /** 왼쪽 큰 글자 (예: 월) */
  label: string;
  /** 왼쪽 보조 문구 (예: 약 30분, 쉬는 날). 값에 따른 문구는 사용처에서 만든다 */
  description?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
};

export function NumericSpinner({
  label,
  description,
  value,
  onChange,
  min,
  max,
  step,
  className,
}: NumericSpinnerProps) {
  return (
    <View
      className={cn("h-10 flex-row items-center justify-between", className)}
    >
      <View className="flex-row items-center gap-3">
        <Text className="text-center text-primary text-title2-sb">{label}</Text>
        {description && (
          <Text className="text-tertiary text-caption1-m">{description}</Text>
        )}
      </View>
      <NumberStepper
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        accessibilityLabel={label}
      />
    </View>
  );
}
