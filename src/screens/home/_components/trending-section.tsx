import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";

import { TextButton } from "@/components/button/text-button";
import { ButtonCard } from "@/components/button-card/button-card";
import { RankingRow } from "@/components/button-card/ranking-row";
import { Chip } from "@/components/chip/chip";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { AchievementCard } from "@/screens/_components/achievement-card";
import type { UserType } from "@/stores/onboarding-store";

type TrendingArticle = {
  title: string;
  url: string;
  viewers: number;
};

type TrendingChip = {
  /** 예: '내 직군 · 기획·마케팅', '전체' */
  label: string;
  /** 서버 직군 코드. 전체는 null */
  jobGroup: string | null;
  /** 칩 범위의 데이터가 모자라 순위를 못 낼 때 true — 목록 자리에 집계중 카드를 보여준다 */
  isAggregating: boolean;
  articles: TrendingArticle[];
};

type TrendingSectionProps = {
  /** 유형별 길 이름 (출근길 · 등굣길 · 이동길) */
  route: string;
  /** 유형별 사람 호칭 (직장인 · 학생 · 유저) */
  person: string;
  /** 집계중 카드의 곰 캐릭터 */
  userType: UserType;
  /** 보여줄 순서대로 */
  chips: TrendingChip[];
  /** 전체보기에서도 같은 칩을 고르도록 지금 고른 칩 위치를 넘긴다 */
  onSeeAllPress: (chipIndex: number) => void;
  onArticlePress: (url: string) => void;
  className?: string;
};

export function TrendingSection({
  route,
  person,
  userType,
  chips,
  onSeeAllPress,
  onArticlePress,
  className,
}: TrendingSectionProps) {
  const [pickedIndex, setPickedIndex] = useState(0);
  // 다시 받은 칩이 줄어도 비지 않게 마지막 칩으로 맞춘다
  const selectedIndex = Math.min(pickedIndex, chips.length - 1);
  const selected = chips[selectedIndex];
  const aggregatingChip = selected?.isAggregating
    ? (selected.jobGroup ?? "all")
    : null;
  const hasSentAggregatingRef = useRef(false);

  // 칩마다 집계중 여부가 달라 집계중 칩이 처음 보일 때 1번 보낸다 (홈 탭은 마운트된 채 남아 앱을 다시 켜기 전까지 1번)
  useEffect(() => {
    if (aggregatingChip === null || hasSentAggregatingRef.current) return;
    hasSentAggregatingRef.current = true;
    track("home_aggregating_view", { screen: "home", chip: aggregatingChip });
  }, [aggregatingChip]);

  return (
    <View className={cn("gap-3.5", className)}>
      <View className="flex-row items-start justify-between">
        <Text className="text-primary text-title2-sb">
          지금 {route}에서 많이 봐요
        </Text>
        <TextButton
          label="전체보기"
          onPress={() => onSeeAllPress(selectedIndex)}
        />
      </View>
      {/* 고른 직군이 많으면 칩이 화면 밖으로 나가지 않게 줄을 바꾼다 */}
      <View className="flex-row flex-wrap gap-2">
        {chips.map((chip, i) => (
          <Chip
            key={chip.label}
            label={chip.label}
            selected={i === selectedIndex}
            onPress={() => setPickedIndex(i)}
          />
        ))}
      </View>
      {selected?.isAggregating ? (
        <AchievementCard
          title="축하합니다! 당신은 1등 갓생러"
          description="데이터를 집계중이에요"
          userType={userType}
        />
      ) : (
        <ButtonCard>
          {selected?.articles.map((article, i) => (
            <RankingRow
              key={article.url}
              rank={i + 1}
              title={article.title}
              subtext={`오늘 ${route} ${person} ${article.viewers.toLocaleString("ko-KR")}명이 보고 있어요`}
              isLive
              hasArrow={false}
              rankTone="brand"
              // 홈은 미리보기라 한 줄로 자르고 전체 제목은 '전체보기'에서 본다
              titleNumberOfLines={1}
              onPress={() => onArticlePress(article.url)}
            />
          ))}
        </ButtonCard>
      )}
    </View>
  );
}
