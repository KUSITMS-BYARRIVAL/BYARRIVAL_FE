import { Pressable, type PressableProps, Text, View } from "react-native";

import { ArrowRightSIcon } from "@/assets/icons";
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
          <Text
            className={cn(
              "text-label2-sb",
              // shortcut: 비활성 글자색이 Figma에 없어 tertiary로 가정, 디자인 확정 시 교체
              props.disabled ? "text-tertiary" : "text-secondary",
            )}
          >
            {label}
          </Text>
          {hasArrow && <ArrowRightSIcon color={SEMANTIC.icon.secondary} />}
        </>
      )}
    </Pressable>
  );
}
