import { cva } from "class-variance-authority";
import type { ReactNode } from "react";
import { Pressable, type PressableProps, Text, View } from "react-native";

import { CheckCircleIcon } from "@/assets/icons";
import { cn } from "@/lib/cn";
import { PALETTE } from "@/theme/colors";

type TileSize = "s" | "l";

// 온보딩 관심 카테고리·직군 선택에서만 쓰여 onboarding/_components에 둔다
// l: Figma SelectionButton_Category (172×160), s: SelectionButton_Job (113×112)
const containerVariants = cva("items-center justify-end border", {
  variants: {
    size: {
      l: "h-[160px] w-[172px] rounded p-5",
      // Figma 직군 버튼은 카테고리 버튼을 0.89배로 줄인 값(둥글기 17.8px)이라 가까운 radius 토큰을 쓴다
      s: "h-[112px] w-[113px] rounded-md p-4",
    },
    isSelected: {
      true: "border-brand bg-card-green",
      false: "border-transparent bg-white",
    },
  },
});

const TITLE_CLASS: Record<TileSize, string> = {
  l: "text-label1-sb",
  s: "text-body2-sb",
};

// 체크 표시 크기와 위치 (Figma 기준)
const INDICATOR = {
  l: { size: 30, top: 13, right: 14 },
  s: { size: 21, top: 10, right: 11 },
};

type SelectionTileProps = Omit<PressableProps, "children"> & {
  /** 40px 아이콘. 카테고리·직군마다 달라 노드로 받는다 */
  icon: ReactNode;
  title: string;
  /** 영문 보조 문구 (예: Economy) */
  subtitle?: string;
  size?: TileSize;
  isSelected?: boolean;
  className?: string;
};

export function SelectionTile({
  icon,
  title,
  subtitle,
  size = "l",
  isSelected = false,
  className,
  accessibilityState,
  ...props
}: SelectionTileProps) {
  const indicator = INDICATOR[size];

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ ...accessibilityState, checked: isSelected }}
      className={cn(containerVariants({ size, isSelected }), className)}
      {...props}
    >
      <View className={cn("items-center", size === "l" ? "gap-2" : "gap-1")}>
        <View className="size-10 items-center justify-center">{icon}</View>
        <View className="items-center">
          <Text
            className={cn(
              "text-center",
              TITLE_CLASS[size],
              isSelected ? "text-primary" : "text-secondary",
            )}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              className={cn(
                "text-center text-caption1-m",
                isSelected ? "text-brand" : "text-tertiary",
              )}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {isSelected && (
        <CheckCircleIcon
          width={indicator.size}
          height={indicator.size}
          color={PALETTE.green[500]}
          style={{
            position: "absolute",
            top: indicator.top,
            right: indicator.right,
          }}
        />
      )}
    </Pressable>
  );
}
