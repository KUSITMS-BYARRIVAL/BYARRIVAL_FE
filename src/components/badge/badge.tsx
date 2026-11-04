import { cva } from "class-variance-authority";
import { Text, View } from "react-native";

import { cn } from "@/lib/cn";

type BadgeColor = "brand" | "neutral";
type BadgeSize = "s" | "m";

// 맞는 시맨틱 배경 토큰이 없어 팔레트를 쓴다
const containerVariants = cva("items-center justify-center rounded-full", {
  variants: {
    size: {
      s: "h-7 px-2.5",
      m: "px-3 py-1.5",
    },
    color: {
      brand: "bg-green-opacity-100",
      neutral: "bg-grey-opacity-50",
    },
  },
});

const labelVariants = cva("", {
  variants: {
    size: {
      s: "text-caption1-m",
      m: "text-label2-sb",
    },
    color: {
      brand: "text-brand",
      neutral: "text-secondary",
    },
  },
});

type BadgeProps = {
  label: string;
  color?: BadgeColor;
  size?: BadgeSize;
  className?: string;
};

export function Badge({
  label,
  color = "brand",
  // Figma에서 neutral은 M으로만 쓰인다
  size = color === "neutral" ? "m" : "s",
  className,
}: BadgeProps) {
  return (
    <View className={cn(containerVariants({ size, color }), className)}>
      <Text className={labelVariants({ size, color })}>{label}</Text>
    </View>
  );
}
