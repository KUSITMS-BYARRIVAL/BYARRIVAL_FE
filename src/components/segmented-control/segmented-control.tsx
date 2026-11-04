import { Pressable, Text, View } from "react-native";

import { cn } from "@/lib/cn";

type SegmentedControlOption = {
  value: string;
  label: string;
};

type SegmentedControlProps = {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function SegmentedControl({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps) {
  return (
    <View
      accessibilityRole="tablist"
      className={cn(
        "flex-row items-center gap-2 rounded-sm bg-grey-opacity-100 p-1",
        className,
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            className={cn(
              "items-center justify-center rounded-sm px-2 py-1",
              isSelected && "bg-white",
            )}
            onPress={() => onChange(option.value)}
          >
            <Text
              className={cn(
                isSelected
                  ? "text-strong text-label3-sb"
                  : "text-tertiary text-caption1-m",
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
