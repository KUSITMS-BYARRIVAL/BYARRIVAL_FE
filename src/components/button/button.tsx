import { cva } from "class-variance-authority";
import { Pressable, type PressableProps, Text, View } from "react-native";

import {
  ArrowLeftLIcon,
  ArrowLeftSIcon,
  ArrowRightLIcon,
  ArrowRightSIcon,
} from "@/assets/icons";
import { cn } from "@/lib/cn";
import { SEMANTIC } from "@/theme/colors";

type ButtonColor = "brand" | "neutral" | "neutral-weak" | "danger";
type ButtonSize = "xs" | "s" | "m" | "l";
type ContentColor = "on-fill-default" | "on-fill-muted" | "secondary";

const containerVariants = cva(
  "flex-row items-center justify-center overflow-hidden",
  {
    variants: {
      size: {
        xs: "h-8 rounded-full px-2.5",
        s: "h-12 rounded-md px-4",
        m: "h-12 rounded-md px-4",
        l: "h-14 rounded-md px-7",
      },
      color: {
        brand: "bg-btn-brand",
        neutral: "bg-btn-neutral",
        "neutral-weak": "bg-btn-neutral-weak",
        danger: "bg-btn-danger",
      },
      icon: { left: "", right: "" },
      disabled: { true: "" },
    },
    compoundVariants: [
      { size: "xs", icon: "left", className: "pl-0.5" },
      { size: "xs", icon: "right", className: "pr-0.5" },
      { size: ["s", "m"], icon: "left", className: "pl-1.5" },
      { size: ["s", "m"], icon: "right", className: "pr-1.5" },
      { size: "l", icon: "left", className: "pl-5" },
      { size: "l", icon: "right", className: "pr-5" },
      { disabled: true, color: "brand", className: "bg-btn-selected" },
      {
        disabled: true,
        color: ["neutral", "neutral-weak", "danger"],
        className: "bg-btn-disabled",
      },
    ],
  },
);

const LABEL_CLASS: Record<ButtonSize, string> = {
  xs: "text-label3-sb",
  s: "text-label2-sb",
  m: "text-label1-sb",
  l: "text-label1-sb",
};

// 동적 클래스 이름은 Tailwind가 수집하지 못하므로 리터럴로 매핑한다
const TEXT_CLASS: Record<ContentColor, string> = {
  "on-fill-default": "text-on-fill-default",
  "on-fill-muted": "text-on-fill-muted",
  secondary: "text-secondary",
};

// Figma 화살표는 L만 그림(비율·선 굵기)이 달라 xs·s·m은 S를 쓴다
const ARROW_ICONS = {
  left: { s: ArrowLeftSIcon, l: ArrowLeftLIcon },
  right: { s: ArrowRightSIcon, l: ArrowRightLIcon },
};

function getContentColor(
  color: ButtonColor,
  isDisabled: boolean,
  isPressed: boolean,
): ContentColor {
  if (isDisabled)
    return color === "brand" ? "on-fill-muted" : "on-fill-default";
  if (color === "neutral-weak") return "secondary";
  return isPressed ? "on-fill-muted" : "on-fill-default";
}

type ButtonProps = Omit<PressableProps, "children"> & {
  label: string;
  color?: ButtonColor;
  size?: ButtonSize;
  icon?: "left" | "right";
  className?: string;
};

export function Button({
  label,
  color = "brand",
  size = "m",
  icon,
  disabled,
  className,
  accessibilityState,
  ...props
}: ButtonProps) {
  const isDisabled = !!disabled;
  const ArrowIcon = icon && ARROW_ICONS[icon][size === "l" ? "l" : "s"];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ ...accessibilityState, disabled: isDisabled }}
      disabled={isDisabled}
      className={cn(
        containerVariants({ size, color, icon, disabled: isDisabled }),
        className,
      )}
      {...props}
    >
      {({ pressed }) => {
        const contentColor = getContentColor(color, isDisabled, pressed);
        const iconColor = SEMANTIC.text[contentColor];
        return (
          <>
            {pressed && <View className="absolute inset-0 bg-btn-pressed" />}
            {icon === "left" && ArrowIcon && <ArrowIcon color={iconColor} />}
            <Text className={cn(LABEL_CLASS[size], TEXT_CLASS[contentColor])}>
              {label}
            </Text>
            {icon === "right" && ArrowIcon && <ArrowIcon color={iconColor} />}
          </>
        );
      }}
    </Pressable>
  );
}
