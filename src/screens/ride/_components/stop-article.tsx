import { Image } from "expo-image";
import { Text, View } from "react-native";

import { ClockIcon } from "@/assets/icons";
import { Badge } from "@/components/badge/badge";
import { CategoryBadge } from "@/components/badge/category-badge";
import { Button } from "@/components/button/button";
import { cn } from "@/lib/cn";
import { CATEGORY_IMAGES, CATEGORY_KEY_BY_ID } from "@/screens/_constants";
import type { RouteStop } from "@/types/ride/ride.types";
import { formatDotDate } from "@/utils/format-date";

// [임시] 서버 키워드에 '#'이 붙어 오는지 확인 전이라 없을 때만 붙인다 (시안은 '#키워드')
const toHashtag = (keyword: string) =>
  keyword.startsWith("#") ? keyword : `#${keyword}`;

type StopArticleProps = {
  /** available이 true인 정거장만 넘긴다 (false면 기사 내용이 null) */
  stop: RouteStop;
  onOriginalPress: () => void;
  className?: string;
};

export function StopArticle({
  stop,
  onOriginalPress,
  className,
}: StopArticleProps) {
  return (
    <View className={cn("gap-6", className)}>
      <View className="gap-3">
        <View className="flex-row items-center gap-1">
          <CategoryBadge
            category={CATEGORY_KEY_BY_ID[stop.categoryId]}
            label={stop.categoryName}
          />
          <View className="flex-row items-center gap-1">
            <View className="size-5 items-center justify-center">
              <ClockIcon width={20} height={20} />
            </View>
            <Text className="text-secondary text-caption1-m">
              {stop.readingMinutes}분 완독
            </Text>
          </View>
        </View>
        <View className="gap-1">
          <Text className="text-primary text-title1-sb" numberOfLines={2}>
            {stop.title}
          </Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-tertiary text-caption1-m">
              {formatDotDate(new Date(stop.publishedAt))}
            </Text>
            <Text className="text-tertiary text-caption1-m">
              {stop.pressName}
            </Text>
          </View>
        </View>
      </View>
      <View className="gap-3.5">
        <View className="gap-2">
          {/* 키워드가 여러 개일 때 처리는 미정이라 임시로 가로 나열 후 줄바꿈 */}
          <View className="flex-row flex-wrap gap-2">
            {stop.keywords.map((keyword) => (
              <Badge key={keyword} label={toHashtag(keyword)} />
            ))}
          </View>
          <View className="overflow-hidden rounded">
            <Image
              // 기사 이미지가 API에 없어 카테고리 이미지 5장 중 하나를 기사마다 고정으로 고른다 (뉴스 탑승하기와 같은 이미지)
              source={CATEGORY_IMAGES[stop.categoryId][stop.articleId % 5]}
              contentFit="cover"
              style={{ width: "100%", height: 150 }}
            />
            <View className="gap-2 bg-card-green p-5">
              <Text className="text-secondary text-caption1-m">
                AI가 요약한 핵심 내용
              </Text>
              <View className="gap-1.5">
                {stop.summary.map((point, i) => (
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
