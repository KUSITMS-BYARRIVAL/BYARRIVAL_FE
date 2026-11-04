import type { ComponentType } from "react";
import { Pressable, type PressableProps, Text, View } from "react-native";
import type { SvgProps } from "react-native-svg";

import { CategoryEconomyIllustration } from "@/assets/illustrations";
import { CategoryBadge } from "@/components/badge/category-badge";
import { cn } from "@/lib/cn";
import type { Category } from "@/theme/category";

// TODO: Figma에 경제 아이콘만 있어 나머지 카테고리는 디자인이 나오면 추가한다
const CATEGORY_ILLUSTRATION: Partial<
  Record<Category, ComponentType<SvgProps>>
> = { economy: CategoryEconomyIllustration };

type TermCardProps = Omit<PressableProps, "children"> & {
  category: Category;
  categoryLabel: string;
  term: string;
  definition: string;
  className?: string;
};

export function TermCard({
  category,
  categoryLabel,
  term,
  definition,
  className,
  ...props
}: TermCardProps) {
  const Illustration = CATEGORY_ILLUSTRATION[category];

  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        "h-[185px] w-[246px] overflow-hidden rounded bg-white p-5",
        className,
      )}
      {...props}
    >
      {({ pressed }) => (
        <>
          {/* 카드 오른쪽 밖으로 일부 잘려 보이도록 Figma 위치 그대로 둔다 */}
          {Illustration && (
            <Illustration
              style={{ position: "absolute", top: 50, right: -46 }}
            />
          )}
          <View className="items-start gap-3.5">
            <CategoryBadge category={category} label={categoryLabel} />
            <View className="gap-2 self-stretch">
              <Text className="text-primary text-title3-sb">{term}</Text>
              <Text className="text-secondary text-body2-m">{definition}</Text>
            </View>
          </View>
          {pressed && <View className="absolute inset-0 bg-card-pressed-2" />}
        </>
      )}
    </Pressable>
  );
}
