import { ScrollView } from "react-native";

import { CategoryChip } from "@/components/chip/category-chip";
import { CATEGORY_KEY_BY_ID } from "@/screens/_constants";

type CategoryFilterProps = {
  /** '전체' 뒤에 보여줄 카테고리 칩 */
  chips: { categoryId: number; name: string }[];
  value: number | "all";
  onChange: (value: number | "all") => void;
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
      <CategoryChip
        category="all"
        label="전체"
        selected={value === "all"}
        onPress={() => onChange("all")}
      />
      {chips.map((chip) => (
        <CategoryChip
          key={chip.categoryId}
          category={CATEGORY_KEY_BY_ID[chip.categoryId]}
          label={chip.name}
          selected={value === chip.categoryId}
          onPress={() => onChange(chip.categoryId)}
        />
      ))}
    </ScrollView>
  );
}
