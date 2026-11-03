import { Pressable, type PressableProps, Text } from "react-native";

import { cn } from "@/lib/cn";
import type { SEMANTIC } from "@/theme/colors";

type ChipCategory = "all" | keyof typeof SEMANTIC.category.background;

// 동적 클래스 이름은 Tailwind가 수집하지 못하므로 리터럴로 매핑한다
// 선택 배경은 카테고리 글자색과 같은데 맞는 시맨틱 배경 토큰이 없어 팔레트를 쓴다
const CATEGORY_CLASS: Record<
  ChipCategory,
  { bg: string; selectedBg: string; text: string }
> = {
  all: {
    bg: "bg-btn-neutral-weak",
    selectedBg: "bg-btn-neutral",
    text: "text-primary",
  },
  economy: {
    bg: "bg-category-economy",
    selectedBg: "bg-light-green-600",
    text: "text-category-economy",
  },
  tech: {
    bg: "bg-category-tech",
    selectedBg: "bg-ice-blue-600",
    text: "text-category-tech",
  },
  career: {
    bg: "bg-category-career",
    selectedBg: "bg-marine-blue-600",
    text: "text-category-career",
  },
  science: {
    bg: "bg-category-science",
    selectedBg: "bg-royal-blue-600",
    text: "text-category-science",
  },
  society: {
    bg: "bg-category-society",
    selectedBg: "bg-cobalt-600",
    text: "text-category-society",
  },
  global: {
    bg: "bg-category-global",
    selectedBg: "bg-navy-600",
    text: "text-category-global",
  },
  life: {
    bg: "bg-category-life",
    selectedBg: "bg-blue-purple-600",
    text: "text-category-life",
  },
  culture: {
    bg: "bg-category-culture",
    selectedBg: "bg-purple-600",
    text: "text-category-culture",
  },
};

type CategoryChipProps = Omit<PressableProps, "children"> & {
  category: ChipCategory;
  // TODO: 카테고리 → 한글 라벨(전체·경제…) 매핑은 도메인 작업 때 추가하고 label prop을 대체한다
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
  const { bg, selectedBg, text } = CATEGORY_CLASS[category];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ ...accessibilityState, selected }}
      className={cn(
        "h-8 w-[58px] items-center justify-center rounded-full",
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
