import { useState } from "react";
import { Text, View } from "react-native";

import { TextButton } from "@/components/button/text-button";
import { ButtonCard } from "@/components/button-card/button-card";
import { RankingRow } from "@/components/button-card/ranking-row";
import { Chip } from "@/components/chip/chip";
import { cn } from "@/lib/cn";
import { AchievementCard } from "@/screens/_components/achievement-card";

type TrendingScope = "region" | "all";

type TrendingArticle = {
  title: string;
  url: string;
  viewers: number;
};

type TrendingSectionProps = {
  /** 내 지역 칩에 붙는 지역 이름 (예: 여의도) */
  region: string;
  articles: Record<TrendingScope, TrendingArticle[]>;
  /** 새벽 4시 집계 전이면 false — 목록 자리에 집계중 카드를 보여준다 */
  isReady: boolean;
  onSeeAllPress: () => void;
  onArticlePress: (url: string) => void;
  className?: string;
};

export function TrendingSection({
  region,
  articles,
  isReady,
  onSeeAllPress,
  onArticlePress,
  className,
}: TrendingSectionProps) {
  const [scope, setScope] = useState<TrendingScope>("region");

  return (
    <View className={cn("gap-3.5", className)}>
      <View className="flex-row items-start justify-between">
        <Text className="text-primary text-title2-sb">
          지금 출근길에서 많이 봐요
        </Text>
        <TextButton label="전체보기" onPress={onSeeAllPress} />
      </View>
      <View className="flex-row gap-2">
        <Chip
          label={`내 지역 · ${region}`}
          selected={scope === "region"}
          onPress={() => setScope("region")}
        />
        <Chip
          label="전체"
          selected={scope === "all"}
          onPress={() => setScope("all")}
        />
      </View>
      {isReady ? (
        <ButtonCard>
          {articles[scope].map((article, i) => (
            <RankingRow
              key={article.url}
              rank={i + 1}
              title={article.title}
              subtext={`오늘 출근길 직장인 ${article.viewers.toLocaleString("ko-KR")}명이 보고 있어요`}
              isLive
              hasArrow={false}
              rankTone="brand"
              // 홈은 미리보기라 한 줄로 자르고 전체 제목은 '전체보기'에서 본다
              titleNumberOfLines={1}
              onPress={() => onArticlePress(article.url)}
            />
          ))}
        </ButtonCard>
      ) : (
        <AchievementCard
          title="축하합니다! 당신은 1등 갓생러"
          description="데이터를 집계중이에요"
        />
      )}
    </View>
  );
}
