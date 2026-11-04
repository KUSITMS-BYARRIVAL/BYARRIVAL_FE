import { Image } from "expo-image";
import { Text, View } from "react-native";

import { AiIcon } from "@/assets/icons";
import { CategoryBadge } from "@/components/badge/category-badge";
import { BookmarkButton } from "@/components/bookmark-button/bookmark-button";
import { cn } from "@/lib/cn";
import { PALETTE } from "@/theme/colors";
import type { Category } from "@/theme/category";

type ScrappedArticleCardProps = {
  category: Category;
  categoryLabel: string;
  /** 스크랩한 시각 (예: 13:32) */
  scrappedAt: string;
  title: string;
  imageUrl: string;
  aiSummary: string;
  bookmarked: boolean;
  onBookmarkPress: () => void;
  className?: string;
};

export function ScrappedArticleCard({
  category,
  categoryLabel,
  scrappedAt,
  title,
  imageUrl,
  aiSummary,
  bookmarked,
  onBookmarkPress,
  className,
}: ScrappedArticleCardProps) {
  return (
    <View className={cn("gap-3 rounded bg-white p-5", className)}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <CategoryBadge category={category} label={categoryLabel} />
          <Text className="text-tertiary text-body3-m">{scrappedAt}</Text>
        </View>
        <BookmarkButton bookmarked={bookmarked} onPress={onBookmarkPress} />
      </View>
      <View className="flex-row items-start justify-between gap-3">
        <Text className="max-w-[242px] flex-1 text-primary text-body1-m">
          {title}
        </Text>
        <Image
          source={{ uri: imageUrl }}
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
          {aiSummary}
        </Text>
      </View>
    </View>
  );
}
