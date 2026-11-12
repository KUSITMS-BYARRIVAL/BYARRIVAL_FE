import { ScrollView } from "react-native";

import { CategoryChip } from "@/components/chip/category-chip";
import type { ARCHIVE_CATEGORIES } from "@/screens/archive/_constants";
import type { Category } from "@/theme/category";

type CategoryFilterProps = {
  /** '전체' 뒤에 보여줄 카테고리 칩 */
  chips: typeof ARCHIVE_CATEGORIES;
  value: Category | "all";
  onChange: (value: Category | "all") => void;
};

export function CategoryFilter({
  chips,
  value,
  onChange,
}: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2.5 px-5"
    >
      {[{ value: "all" as const, label: "전체" }, ...chips].map((chip) => (
        <CategoryChip
          key={chip.value}
          category={chip.value}
          label={chip.label}
          selected={value === chip.value}
          onPress={() => onChange(chip.value)}
        />
      ))}
    </ScrollView>
  );
}
