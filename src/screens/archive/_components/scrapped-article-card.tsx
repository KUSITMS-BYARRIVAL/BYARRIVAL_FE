import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { AiIcon } from "@/assets/icons";
import { CategoryBadge } from "@/components/badge/category-badge";
import { BookmarkButton } from "@/components/bookmark-button/bookmark-button";
import { cn } from "@/lib/cn";
import { PALETTE } from "@/theme/colors";
import type { Category } from "@/theme/category";

type ScrappedArticleCardProps = {
  category: Category;
  categoryLabel: string;
  title: string;
  image: string | number;
  aiSummary: string;
  isBookmarked: boolean;
  /** 원문이 삭제된 기사. 흐리게 보이고 눌러도 열리지 않는다 (북마크로 삭제만 가능) */
  isDeleted?: boolean;
  onPress?: () => void;
  onBookmarkPress?: () => void;
  className?: string;
};

export function ScrappedArticleCard({
  category,
  categoryLabel,
  title,
  image,
  aiSummary,
  isBookmarked,
  isDeleted = false,
  onPress,
  onBookmarkPress,
  className,
}: ScrappedArticleCardProps) {
  return (
    <View className={cn("relative", className)}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDeleted }}
        onPress={isDeleted ? undefined : onPress}
        className="rounded bg-white p-5"
      >
        {/* shortcut: 흐림 정도 40%는 Figma 시안이 없어 임의로 정했다. 디자인 확인 중이라 값이 나오면 맞출 것 */}
        <View className={cn("gap-3", isDeleted && "opacity-40")}>
          {/* 북마크 버튼(28px) 자리만큼 높이를 맞춘다 */}
          <View className="min-h-7 flex-row items-center">
            {/* TODO: 카테고리 태그는 UT 이후 디자인이 바뀐다 */}
            <CategoryBadge category={category} label={categoryLabel} />
          </View>
          <View className="flex-row items-start justify-between gap-3">
            <Text className="max-w-[242px] flex-1 text-primary text-body1-m">
              {title}
            </Text>
            <Image
              source={image}
              contentFit="cover"
              // expo-image는 NativeWind className을 받지 않아 style로 지정 (rounded-sm = 8)
              style={{ width: 60, height: 60, borderRadius: 8 }}
            />
          </View>
          <View className="flex-row items-center gap-2 rounded-sm bg-grey-opacity-100 p-2.5">
            <View className="size-5 items-center justify-center rounded-full bg-green-500">
              <AiIcon color={PALETTE.green[50]} />
            </View>
            <Text className="flex-1 text-secondary text-caption1-m">
              {isDeleted ? "삭제된 기사예요" : aiSummary}
            </Text>
          </View>
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
