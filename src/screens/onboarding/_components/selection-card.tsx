import type { ReactNode } from "react";
import { Pressable, type PressableProps, Text, View } from "react-native";

import { CheckCircleIcon } from "@/assets/icons";
import { cn } from "@/lib/cn";
import { PALETTE } from "@/theme/colors";

type SelectionCardProps = Omit<PressableProps, "children"> & {
  /** 왼쪽 50px 칸에 들어갈 30px 그림 (예: AssetSuitIllustration) */
  asset: ReactNode;
  title: string;
  description?: string;
  isSelected?: boolean;
  className?: string;
};

// 온보딩 직업 유형 선택에서만 쓰여 onboarding/_components에 둔다. Figma Selection Card. 그림 칸은 카드 전체가 눌리므로 AssetTile(Pressable) 대신 같은 모양의 View로 둔다
export function SelectionCard({
  asset,
  title,
  description,
  isSelected = false,
  className,
  accessibilityState,
  ...props
}: SelectionCardProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ ...accessibilityState, checked: isSelected }}
      className={cn(
        "flex-row items-center gap-4 rounded-md border p-5",
        isSelected
          ? "border-brand bg-card-green"
          : "border-transparent bg-white",
        className,
      )}
      {...props}
    >
      <View
        className={cn(
          "size-[50px] items-center justify-center rounded-sm",
          isSelected ? "bg-green-opacity-100" : "bg-grey-50",
        )}
      >
        {asset}
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-strong text-title3-sb">{title}</Text>
        {description && (
          <Text className="text-tertiary text-body2-r">{description}</Text>
        )}
      </View>
      <CheckCircleIcon
        width={30}
        height={30}
        color={isSelected ? PALETTE.green[500] : PALETTE.green[100]}
      />
    </Pressable>
  );
}
