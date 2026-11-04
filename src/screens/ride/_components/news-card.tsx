import { Image } from "expo-image";
import { Text, View } from "react-native";

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
  imageUrl: string;
  className?: string;
};

export function NewsCard({
  category,
  categoryLabel,
  readMinutes,
  title,
  imageUrl,
  className,
}: NewsCardProps) {
  return (
    <View className={cn("overflow-hidden rounded", className)}>
      <View className="gap-2 bg-white p-5">
        <View className="flex-row items-center gap-2">
          <CategoryBadge category={category} label={categoryLabel} />
          <View className="flex-row items-center gap-1">
            <View className="size-5 items-center justify-center">
              <ClockIcon />
            </View>
            <Text className="text-secondary text-caption1-m">
              {readMinutes}분
            </Text>
          </View>
        </View>
        <Text className="text-primary text-title2-sb">{title}</Text>
      </View>
      <Image
        source={{ uri: imageUrl }}
        contentFit="cover"
        style={{ width: "100%", height: 267 }}
      />
    </View>
  );
}
