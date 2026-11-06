import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { ClockIcon } from "@/assets/icons";
import { CategoryBadge } from "@/components/badge/category-badge";
import { cn } from "@/lib/cn";
import type { Category } from "@/theme/category";

type NewsCardProps = {
  category: Category;
  categoryLabel: string;
  /** 읽는 데 걸리는 시간(분) */
  readMinutes: number;
  title: string;
  image: string | number;
  /** 뉴스 탑승하기에서 고른 기사면 초록 테두리 */
  isSelected?: boolean;
  onPress?: () => void;
  className?: string;
};

export function NewsCard({
  category,
  categoryLabel,
  readMinutes,
  title,
  image,
  isSelected = false,
  onPress,
  className,
}: NewsCardProps) {
  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      accessibilityRole={onPress ? "checkbox" : undefined}
      accessibilityState={onPress ? { checked: isSelected } : undefined}
      // 테두리는 AI 요약 카드(summary-card)와 같다. 선택 전에도 두께를 둬 눌러도 크기가 바뀌지 않게 한다
      className={cn(
        "overflow-hidden rounded border",
        isSelected ? "border-brand" : "border-transparent",
        className,
      )}
    >
      <View className="gap-2 bg-white p-5">
        <View className="flex-row items-center gap-2">
          <CategoryBadge category={category} label={categoryLabel} />
          <View className="flex-row items-center gap-1">
            <View className="size-5 items-center justify-center">
              <ClockIcon width={20} height={20} />
            </View>
            <Text className="text-secondary text-caption1-m">
              {readMinutes}분
            </Text>
          </View>
        </View>
        <Text className="text-primary text-title2-sb">{title}</Text>
      </View>
      <Image
        source={image}
        contentFit="cover"
        style={{ width: "100%", height: 267 }}
      />
    </Pressable>
  );
}
