import { Pressable, type PressableProps, Text } from "react-native";

import { cn } from "@/lib/cn";
import { type Category, CATEGORY_CLASS } from "@/theme/category";

type ChipCategory = "all" | Category;

// "전체"는 카테고리가 아닌 필터 선택지라 칩에만 둔다
const CHIP_CLASS = {
  ...CATEGORY_CLASS,
  all: {
    bg: "bg-btn-neutral-weak",
    text: "text-primary",
    selectedBg: "bg-btn-neutral",
  },
};

type CategoryChipProps = Omit<PressableProps, "children"> & {
  category: ChipCategory;
  // TODO: 한글 라벨 매핑은 서버 카테고리 값 확인 후 도메인 쪽에 추가한다
  label: string;
  selected?: boolean;
  className?: string;
};

export function CategoryChip({
  category,
  label,
  selected = false,
  className,
  accessibilityState,
  ...props
}: CategoryChipProps) {
  const { bg, selectedBg, text } = CHIP_CLASS[category];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ ...accessibilityState, selected }}
      className={cn(
        "min-h-8 min-w-[58px] items-center justify-center rounded-full px-2.5",
        selected ? selectedBg : bg,
        className,
      )}
      {...props}
    >
      <Text
        className={cn(
          "text-label2-sb",
          selected ? "text-on-fill-default" : text,
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
