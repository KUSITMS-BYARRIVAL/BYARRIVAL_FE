import { Pressable, Text, View } from "react-native";

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
  /** 연결된 뉴스 원문이 삭제된 상태. 흐리게 보이고 눌러도 열리지 않는다 (북마크로 삭제만 가능) */
  isDeleted?: boolean;
  onPress?: () => void;
  onBookmarkPress?: () => void;
  className?: string;
};

export function EditorPickSmalltalkCard({
  category,
  categoryLabel,
  newsTitle,
  question,
  followUp,
  isBookmarked,
  isDeleted = false,
  onPress,
  onBookmarkPress,
  className,
}: EditorPickSmalltalkCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDeleted }}
      onPress={isDeleted ? undefined : onPress}
      className={cn("rounded bg-white p-5", className)}
    >
      {/* shortcut: 흐림 정도 40%는 Figma 시안이 없어 임의로 정했다. 디자인 확인 중이라 값이 나오면 맞출 것 */}
      <View className={cn("gap-3.5", isDeleted && "opacity-40")}>
        <View className="flex-row items-center justify-between">
          {/* TODO: 카테고리 태그는 UT 이후 디자인이 바뀐다 */}
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
            {isDeleted ? "삭제된 기사예요" : newsTitle}
          </Text>
        </View>
        <Bubble text={question} />
        <Text className="text-secondary text-body3-r">
          <Text className="text-brand text-body3-m">이어서</Text>
          <Text className="text-brand"> · </Text>
          {followUp}
        </Text>
      </View>
    </Pressable>
  );
}
