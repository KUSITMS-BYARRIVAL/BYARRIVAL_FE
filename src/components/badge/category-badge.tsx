import { Text, View } from "react-native";

import { cn } from "@/lib/cn";
import { type Category, CATEGORY_CLASS } from "@/theme/category";

type CategoryBadgeProps = {
  category: Category;
  // TODO: 한글 라벨 매핑은 서버 카테고리 값 확인 후 도메인 쪽에 추가한다
  label: string;
  className?: string;
};

export function CategoryBadge({
  category,
  label,
  className,
}: CategoryBadgeProps) {
  const { bg, text } = CATEGORY_CLASS[category];

  return (
    <View
      className={cn(
        "h-7 w-[50px] items-center justify-center rounded-full",
        bg,
        className,
      )}
    >
      <Text className={cn("text-label3-sb", text)}>{label}</Text>
    </View>
  );
}
