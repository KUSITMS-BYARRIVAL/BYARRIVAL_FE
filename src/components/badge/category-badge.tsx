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

  // 최소 50px, 긴 라벨이나 큰 시스템 글자에서는 라벨에 맞춰 늘어난다
  return (
    <View
      className={cn(
        "min-h-7 min-w-[50px] items-center justify-center rounded-full px-2.5",
        bg,
        className,
      )}
    >
      <Text className={cn("text-label3-sb", text)}>{label}</Text>
    </View>
  );
}
