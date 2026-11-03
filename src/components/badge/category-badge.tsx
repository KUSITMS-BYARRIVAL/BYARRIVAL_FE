import { cva } from "class-variance-authority";
import { Text, View } from "react-native";

import { cn } from "@/lib/cn";
import type { SEMANTIC } from "@/theme/colors";

type Category = keyof typeof SEMANTIC.category.background;

// 동적 클래스 이름은 Tailwind가 수집하지 못하므로 리터럴로 매핑한다
const containerVariants = cva(
  "h-7 w-[50px] items-center justify-center rounded-full",
  {
    variants: {
      category: {
        economy: "bg-category-economy",
        tech: "bg-category-tech",
        career: "bg-category-career",
        science: "bg-category-science",
        society: "bg-category-society",
        global: "bg-category-global",
        life: "bg-category-life",
        culture: "bg-category-culture",
      },
    },
  },
);

const labelVariants = cva("text-label3-sb", {
  variants: {
    category: {
      economy: "text-category-economy",
      tech: "text-category-tech",
      career: "text-category-career",
      science: "text-category-science",
      society: "text-category-society",
      global: "text-category-global",
      life: "text-category-life",
      culture: "text-category-culture",
    },
  },
});

type CategoryBadgeProps = {
  category: Category;
  // TODO: 카테고리 → 한글 라벨(경제·테크…) 매핑은 도메인 작업 때 추가하고 label prop을 대체한다
  label: string;
  className?: string;
};

export function CategoryBadge({
  category,
  label,
  className,
}: CategoryBadgeProps) {
  return (
    <View className={cn(containerVariants({ category }), className)}>
      <Text className={labelVariants({ category })}>{label}</Text>
    </View>
  );
}
