import { Pressable, type PressableProps, Text, View } from "react-native";

import ArrowRightS from "@/assets/icons/arrow-right-s.svg";
import { cn } from "@/lib/cn";
import { SEMANTIC } from "@/theme/colors";

type TextButtonProps = Omit<PressableProps, "children"> & {
  label: string;
  hasArrow?: boolean;
  className?: string;
};

export function TextButton({
  label,
  hasArrow = true,
  className,
  ...props
}: TextButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        "h-6 flex-row items-center justify-center overflow-hidden rounded-sm",
        hasArrow ? "pl-[5px]" : "px-[5px]",
        className,
      )}
      {...props}
    >
      {({ pressed }) => (
        <>
          {pressed && <View className="absolute inset-0 bg-btn-pressed" />}
          <Text className="text-secondary text-label2-sb">{label}</Text>
          {hasArrow && <ArrowRightS color={SEMANTIC.icon.secondary} />}
        </>
      )}
    </Pressable>
  );
}
