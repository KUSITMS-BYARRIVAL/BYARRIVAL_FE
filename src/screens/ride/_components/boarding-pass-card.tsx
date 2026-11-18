import { Text, View } from "react-native";

import { AssetSubwayIllustration } from "@/assets/illustrations";
import { CategoryBadge } from "@/components/badge/category-badge";
import { ProgressStepperSmall } from "@/components/progress-stepper/progress-stepper-small";
import { CATEGORY_KEY_BY_ID } from "@/screens/_constants";
import type { RouteCard } from "@/types/ride/ride.types";

type BoardingPassCardProps = {
  from: string;
  to: string;
  /** 담은 순서 */
  cards: RouteCard[];
  /** 서버가 소수 합을 올린 값이라 카드 읽는 시간을 더한 값과 다를 수 있다 */
  totalMinutes: number;
  className?: string;
};

export function BoardingPassCard({
  from,
  to,
  cards,
  totalMinutes,
  className,
}: BoardingPassCardProps) {
  return (
    <View className={className}>
      <View className="gap-1 rounded-t bg-card-brand p-5">
        <View className="items-center gap-2">
          <View className="flex-row items-center gap-1 rounded-full bg-card-pressed-2 px-3.5 py-1.5">
            <AssetSubwayIllustration width={30} height={30} />
            <Text className="text-on-fill-default text-heading3-sb">
              Boarding Pass
            </Text>
          </View>
          <View className="w-full gap-0.5">
            <View className="flex-row justify-between">
              <Text className="text-tertiary text-label3-sb">From</Text>
              <Text className="text-tertiary text-label3-sb">To</Text>
            </View>
            {/* To가 '도착지'처럼 길어질 수 있어 글자만큼 두고 노선이 남은 폭을 채운다 */}
            <View className="flex-row items-center gap-0.5">
              <Text className="text-on-fill-default text-heading2-sb">
                {from}
              </Text>
              <ProgressStepperSmall
                total={cards.length}
                className="flex-1 px-2.5"
              />
              <Text className="text-on-fill-default text-heading2-sb">
                {to}
              </Text>
            </View>
          </View>
        </View>
        <View className="flex-row gap-3.5">
          <View className="flex-row gap-1">
            <Text className="text-tertiary text-caption1-m">기사 수</Text>
            <Text className="text-on-fill-default text-label3-sb">
              {cards.length}개
            </Text>
          </View>
          <View className="flex-row gap-1">
            <Text className="text-tertiary text-caption1-m">예상 시간</Text>
            <Text className="text-on-fill-default text-label3-sb">
              {totalMinutes}분
            </Text>
          </View>
        </View>
      </View>
      <View className="gap-3 rounded-b bg-card-white p-5">
        {cards.map(
          ({ articleId, categoryId, categoryName, title, readingMinutes }) => (
            <View key={articleId} className="flex-row items-center gap-2">
              <CategoryBadge
                category={CATEGORY_KEY_BY_ID[categoryId]}
                label={categoryName}
              />
              <Text
                numberOfLines={1}
                className="flex-1 text-secondary text-body3-m"
              >
                {title}
              </Text>
              <Text className="text-on-fill-muted text-body3-m">
                {readingMinutes}분
              </Text>
            </View>
          ),
        )}
      </View>
    </View>
  );
}
