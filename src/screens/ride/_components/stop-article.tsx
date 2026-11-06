import { Image } from "expo-image";
import { Text, View } from "react-native";

import { ClockIcon } from "@/assets/icons";
import { Badge } from "@/components/badge/badge";
import { CategoryBadge } from "@/components/badge/category-badge";
import { Button } from "@/components/button/button";
import { cn } from "@/lib/cn";
import type { BoardingArticle } from "@/screens/ride/_components/boarding-pass-card";

export type RideArticle = BoardingArticle & {
  date: string;
  press: string;
  keywords: string[];
  url: string;
  image: string | number;
};

type StopArticleProps = {
  article: RideArticle;
  onOriginalPress: () => void;
  className?: string;
};

export function StopArticle({
  article,
  onOriginalPress,
  className,
}: StopArticleProps) {
  return (
    <View className={cn("gap-9", className)}>
      <View className="gap-3.5">
        <View className="flex-row items-center gap-2">
          <CategoryBadge category={article.category} label={article.label} />
          <View className="flex-row items-center gap-1">
            <View className="size-5 items-center justify-center">
              <ClockIcon width={20} height={20} />
            </View>
            <Text className="text-secondary text-caption1-m">
              {article.minutes}분 완독
            </Text>
          </View>
        </View>
        <View className="gap-2">
          {/* 2줄 표시 여부 미정이라 임시로 1줄 말줄임 */}
          <Text className="text-primary text-title2-sb" numberOfLines={1}>
            {article.title}
          </Text>
          <View className="flex-row items-center gap-[15px]">
            <Text className="text-secondary text-caption1-m">
              {article.date}
            </Text>
            <Text className="text-secondary text-caption1-m">
              {article.press}
            </Text>
          </View>
        </View>
      </View>
      <View className="gap-3.5">
        {/* 키워드가 여러 개일 때 처리는 미정이라 임시로 가로 나열 후 줄바꿈 */}
        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="text-primary text-label3-sb">핵심 키워드</Text>
          <CategoryBadge category={article.category} label={article.label} />
          {article.keywords.map((keyword) => (
            <Badge key={keyword} label={keyword} />
          ))}
        </View>
        <View className="overflow-hidden rounded">
          <Image
            source={article.image}
            contentFit="cover"
            style={{ width: "100%", height: 180 }}
          />
        </View>
        <Button
          label="원문 보기"
          color="neutral"
          size="l"
          onPress={onOriginalPress}
        />
      </View>
    </View>
  );
}
