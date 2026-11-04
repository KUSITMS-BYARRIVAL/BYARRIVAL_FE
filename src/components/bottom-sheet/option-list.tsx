import { Pressable, Text, View } from "react-native";

import { CheckIcon } from "@/assets/icons";
import { cn } from "@/lib/cn";
import { SEMANTIC } from "@/theme/colors";

type Option<T extends string> = { label: string; value: T };

type OptionListProps<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export function OptionList<T extends string>({
  options,
  value,
  onChange,
  className,
}: OptionListProps<T>) {
  return (
    <View accessibilityRole="radiogroup" className={className}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            className="h-14 flex-row items-center justify-between px-5"
            onPress={() => onChange(option.value)}
          >
            <Text
              className={cn(
                selected
                  ? "text-strong text-body1-sb"
                  : "text-secondary text-body1-r",
              )}
            >
              {option.label}
            </Text>
            {selected && <CheckIcon color={SEMANTIC.icon.brand} />}
          </Pressable>
        );
      })}
    </View>
  );
}
