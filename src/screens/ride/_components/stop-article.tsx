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
  /** summary: AI 3줄 요약 (이미지 아래 초록 카드) */
  article: RideArticle & { summary: string[] };
  onOriginalPress: () => void;
  className?: string;
};

export function StopArticle({
  article,
  onOriginalPress,
  className,
}: StopArticleProps) {
  return (
    <View className={cn("gap-6", className)}>
      <View className="gap-3">
        <View className="flex-row items-center gap-1">
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
        <View className="gap-1">
          <Text className="text-primary text-title1-sb" numberOfLines={2}>
            {article.title}
          </Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-tertiary text-caption1-m">
              {article.date}
            </Text>
            <Text className="text-tertiary text-caption1-m">
              {article.press}
            </Text>
          </View>
        </View>
      </View>
      <View className="gap-3.5">
        <View className="gap-2">
          {/* 키워드가 여러 개일 때 처리는 미정이라 임시로 가로 나열 후 줄바꿈 */}
          <View className="flex-row flex-wrap gap-2">
            {article.keywords.map((keyword) => (
              <Badge key={keyword} label={keyword} />
            ))}
          </View>
          <View className="overflow-hidden rounded">
            <Image
              source={article.image}
              contentFit="cover"
              style={{ width: "100%", height: 150 }}
            />
            <View className="gap-2 bg-card-green p-5">
              <Text className="text-secondary text-caption1-m">
                AI가 요약한 핵심 내용
              </Text>
              <View className="gap-1.5">
                {article.summary.map((point, i) => (
                  <View key={i} className="flex-row items-start gap-2">
                    {/* Figma 번호 원은 1~3만 그림으로 있어 개수와 상관없이 쓰도록 원과 숫자로 그린다 */}
                    <View className="size-6 items-center justify-center rounded-full bg-green-500">
                      <Text className="text-on-fill-default text-label2-sb">
                        {i + 1}
                      </Text>
                    </View>
                    <Text className="flex-1 text-primary text-body2-sb">
                      {point}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
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
