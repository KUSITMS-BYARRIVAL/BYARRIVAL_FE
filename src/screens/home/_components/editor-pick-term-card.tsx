import { Text, View } from "react-native";

import { CategoryBadge } from "@/components/badge/category-badge";
import { BookmarkButton } from "@/components/bookmark-button/bookmark-button";
import { cn } from "@/lib/cn";
import type { Category } from "@/theme/category";

type EditorPickTermCardProps = {
  category: Category;
  categoryLabel: string;
  term: string;
  definition: string;
  example: string;
  editorComment: string;
  bookmarked: boolean;
  onBookmarkPress: () => void;
  className?: string;
};

export function EditorPickTermCard({
  category,
  categoryLabel,
  term,
  definition,
  example,
  editorComment,
  bookmarked,
  onBookmarkPress,
  className,
}: EditorPickTermCardProps) {
  return (
    <View className={cn("gap-3.5 rounded bg-white p-5", className)}>
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <CategoryBadge category={category} label={categoryLabel} />
          <BookmarkButton bookmarked={bookmarked} onPress={onBookmarkPress} />
        </View>
        <Text className="text-primary text-title2-sb">{term}</Text>
        <Text className="text-secondary text-body2-m">{definition}</Text>
        <View className="rounded-sm bg-grey-opacity-100 p-2.5">
          <Text className="text-secondary text-body3-m">{example}</Text>
        </View>
      </View>
      <Text className="text-secondary text-body3-r">
        <Text className="text-brand text-body3-m">에디터 한마디 · </Text>
        {editorComment}
      </Text>
    </View>
  );
}
