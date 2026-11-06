import { Text, View } from "react-native";

import { CategoryBadge } from "@/components/badge/category-badge";
import { BookmarkButton } from "@/components/bookmark-button/bookmark-button";
import { Bubble } from "@/components/bubble/bubble";
import { cn } from "@/lib/cn";
import type { Category } from "@/theme/category";

type EditorPickSmalltalkCardProps = {
  category: Category;
  categoryLabel: string;
  newsTitle: string;
  question: string;
  followUp: string;
  isBookmarked: boolean;
  onBookmarkPress: () => void;
  className?: string;
};

export function EditorPickSmalltalkCard({
  category,
  categoryLabel,
  newsTitle,
  question,
  followUp,
  isBookmarked,
  onBookmarkPress,
  className,
}: EditorPickSmalltalkCardProps) {
  return (
    <View className={cn("gap-3.5 rounded bg-white p-5", className)}>
      <View className="flex-row items-center justify-between">
        <CategoryBadge category={category} label={categoryLabel} />
        <BookmarkButton bookmarked={isBookmarked} onPress={onBookmarkPress} />
      </View>
      <View className="flex-row items-center gap-2 rounded-sm bg-grey-700 px-3 py-2.5">
        <Text className="text-on-fill-default text-label3-sb">
          오늘의 뉴스ㆍ{categoryLabel}
        </Text>
        <Text
          numberOfLines={1}
          className="flex-1 text-on-fill-muted text-caption1-r"
        >
          {newsTitle}
        </Text>
      </View>
      <Bubble text={question} />
      <Text className="text-secondary text-body3-r">
        <Text className="text-brand text-body3-m">이어서</Text>
        <Text className="text-brand"> · </Text>
        {followUp}
      </Text>
    </View>
  );
}
