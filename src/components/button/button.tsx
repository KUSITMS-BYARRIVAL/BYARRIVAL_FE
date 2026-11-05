import { cva } from "class-variance-authority";
import type { ReactNode } from "react";
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
      hasLeadingIcon: { true: "gap-2" },
      disabled: { true: "" },
    },
    compoundVariants: [
      { size: "xs", icon: "left", className: "pl-0.5" },
      { size: "xs", icon: "right", className: "pr-0.5" },
      { size: ["s", "m"], icon: "left", className: "pl-1.5" },
      { size: ["s", "m"], icon: "right", className: "pr-1.5" },
      { size: "l", icon: "left", className: "pl-5" },
      { size: "l", icon: "right", className: "pr-5" },
      // Figma Icon-First: 왼쪽 38px 원형 아이콘 버튼. S만 높이가 38px로 다르다
      { size: "xs", hasLeadingIcon: true, className: "pl-1 pr-2.5" },
      { size: "s", hasLeadingIcon: true, className: "h-[38px] pl-3 pr-4" },
      { size: "m", hasLeadingIcon: true, className: "pl-3 pr-4" },
      { size: "l", hasLeadingIcon: true, className: "pl-5 pr-7" },
      { disabled: true, color: "brand", className: "bg-btn-disabled-brand" },
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
  className?: string;
} & (
    | { icon?: "left" | "right"; leadingIcon?: never }
    | {
        icon?: never;
        /** 라벨 앞 아이콘 종류가 늘어날 수 있어 노드로 받는다 */
        leadingIcon?: ReactNode;
      }
  );

export function Button({
  label,
  color = "brand",
  size = "m",
  icon,
  leadingIcon,
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
        containerVariants({
          size,
          color,
          icon,
          hasLeadingIcon: !!leadingIcon,
          disabled: isDisabled,
        }),
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
            {leadingIcon}
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
