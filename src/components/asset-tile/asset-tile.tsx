import type { ReactNode } from "react";
import { Pressable, type PressableProps } from "react-native";

import { cn } from "@/lib/cn";

type AssetTileProps = Omit<PressableProps, "children"> & {
  /** 30px 에셋 그림 (예: AssetSuitIllustration). 종류가 늘어날 수 있어 노드로 받는다 */
  asset: ReactNode;
  /** 스크린리더가 읽을 이름 (예: 정장) */
  label: string;
  isSelected?: boolean;
  className?: string;
};

// Figma Asset-suit·bag·subway의 Background=True 상태. 배경 없는 상태는 일러스트를 그대로 쓴다
export function AssetTile({
  asset,
  label,
  isSelected = false,
  className,
  accessibilityState,
  ...props
}: AssetTileProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ ...accessibilityState, selected: isSelected }}
      className={cn(
        "size-[50px] items-center justify-center rounded-sm",
        isSelected ? "bg-green-opacity-100" : "bg-grey-50",
        className,
      )}
      {...props}
    >
      {asset}
    </Pressable>
  );
}
