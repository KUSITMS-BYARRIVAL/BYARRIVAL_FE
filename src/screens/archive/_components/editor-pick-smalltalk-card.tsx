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
  isBookmarked,
  isDeleted = false,
  onPress,
  onBookmarkPress,
  className,
}: EditorPickSmalltalkCardProps) {
  return (
    <View className={cn("relative", className)}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDeleted }}
        onPress={isDeleted ? undefined : onPress}
        className="rounded bg-white p-5"
      >
        {/* shortcut: 흐림 정도 40%는 Figma 시안이 없어 임의로 정했다. 디자인 확인 중이라 값이 나오면 맞출 것 */}
        <View className={cn("gap-2", isDeleted && "opacity-40")}>
          {/* 북마크 버튼(28px) 자리만큼 높이를 맞춘다 */}
          <View className="min-h-7 flex-row items-center">
            {/* TODO: 카테고리 태그는 UT 이후 디자인이 바뀐다 */}
            <CategoryBadge category={category} label={categoryLabel} />
          </View>
          <View className="flex-row items-center gap-2 rounded-xl bg-grey-700 px-3 py-2.5">
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
        </View>
      </Pressable>
      {/* 카드 버튼 안에 두면 스크린리더가 카드를 한 덩어리로 읽어 북마크에 닿지 못하므로 형제로 겹쳐 둔다 */}
      <BookmarkButton
        bookmarked={isBookmarked}
        onPress={onBookmarkPress}
        className={cn("absolute right-5 top-5", isDeleted && "opacity-40")}
      />
    </View>
  );
}
