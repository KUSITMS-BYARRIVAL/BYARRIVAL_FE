import { Pressable, Text, View } from "react-native";

import { CategoryBadge } from "@/components/badge/category-badge";
import type { Category } from "@/theme/category";

type RecentSavedArticlesCardProps = {
  articles: { id: string; category: Category; label: string; title: string }[];
  onPressMore: () => void;
};

export function RecentSavedArticlesCard({
  articles,
  onPressMore,
}: RecentSavedArticlesCardProps) {
  return (
    <View className="gap-3 rounded bg-card-white p-5">
      <View className="flex-row items-start justify-between">
        <Text className="text-primary text-title2-sb">최근 저장한 기사</Text>
        <Pressable
          accessibilityRole="button"
          hitSlop={10}
          onPress={onPressMore}
        >
          <Text className="text-tertiary text-caption1-m">전체보기</Text>
        </Pressable>
      </View>
      {articles.length === 0 ? (
        // [임시] 빈 상태 디자인이 없어 문구만 둔다
        <Text className="text-center text-tertiary text-body3-m">
          최근 저장한 기사가 없어요!
        </Text>
      ) : (
        <View className="gap-2">
          {articles.map(({ id, category, label, title }) => (
            // [임시] 기사를 눌렀을 때의 디자인이 없어 누를 수 없게 둔다
            <View key={id} className="flex-row items-center gap-1.5">
              <CategoryBadge category={category} label={label} />
              <Text
                className="flex-1 text-primary text-body3-m"
                numberOfLines={1}
              >
                {title}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
