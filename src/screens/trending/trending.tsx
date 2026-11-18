import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ButtonCard } from "@/components/button-card/button-card";
import { RankingRow } from "@/components/button-card/ranking-row";
import { Chip } from "@/components/chip/chip";
import { Header } from "@/components/header/header";
import { LoadingDots } from "@/components/loading-dots/loading-dots";
import { useGetMe } from "@/hooks/queries/use-get-me";
import {
  getPopularQuery,
  useGetPopular,
} from "@/hooks/queries/use-get-popular";
import { AchievementCard } from "@/screens/_components/achievement-card";
import { openArticle, toPopularChipLabel } from "@/screens/_helpers";
import { useCommuteWords } from "@/screens/_hooks/use-commute-words";

export function TrendingScreen() {
  const { top } = useSafeAreaInsets();
  const { route, person, userType } = useCommuteWords();
  const queryClient = useQueryClient();
  const { data: me } = useGetMe();
  const jobGroups = me?.jobGroups;
  // 고른 직군(고른 순서) 다음에 전체(null) — 홈 칩과 같은 순서
  const chips = [...(jobGroups ?? []), null];
  // 칩 위치로 고른다 — 내 정보가 늦게 와도 첫 칩(내 직군)이 기본이 되고, 칩이 줄면 마지막 칩으로 맞춘다
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = chips[Math.min(selectedIndex, chips.length - 1)];
  const { data, isPending, dataUpdatedAt } = useGetPopular(
    selected ?? undefined,
  );
  // 칩 수가 적어(고른 직군 + 전체) 화면을 열 때 모두 받아 두고, 칩을 바꾸면 바로 보여준다
  useEffect(() => {
    [...(jobGroups ?? []), undefined].forEach((jobGroup) =>
      queryClient.query(getPopularQuery(jobGroup)).catch(() => undefined),
    );
  }, [queryClient, jobGroups]);
  const isAggregating = data?.status === "AGGREGATING";
  // [임시] 서버에 집계 시각 필드가 없어 앱이 받은 시각을 보여준다 — 백엔드에 필드 요청 중
  const updatedAt = new Date(dataUpdatedAt).toLocaleTimeString("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <View className="flex-1 bg-default" style={{ paddingTop: top }}>
      <Header title={`지금 ${route}에서 많이 봐요`} onBack={router.back} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 pb-8 pt-3.5"
      >
        <View className="gap-3.5">
          <View className="flex-row items-center gap-2 pl-8">
            <View className="size-2 rounded-full bg-green-500" />
            <Text className="flex-1 text-brand text-caption1-r">
              {/* 첫 응답 전에는 dataUpdatedAt이 0이라 시각을 빼고 보여준다 */}
              {!data
                ? "LIVE"
                : isAggregating
                  ? "LIVE · 첫 순위를 집계하고 있어요"
                  : `LIVE · 오늘 ${updatedAt} 기준`}
            </Text>
          </View>
          <View className="flex-row flex-wrap gap-2 px-5">
            {chips.map((jobGroup, i) => (
              <Chip
                key={jobGroup ?? "all"}
                label={toPopularChipLabel(jobGroup)}
                selected={jobGroup === selected}
                onPress={() => setSelectedIndex(i)}
              />
            ))}
          </View>
        </View>
        <View className="px-5">
          {/* 조회 실패(전역 토스트) · 순위 0건이면 빈 카드를 그리지 않는다 */}
          {isPending ? (
            <LoadingDots className="py-10" />
          ) : isAggregating ? (
            <AchievementCard
              title="축하합니다! 당신은 1등 갓생러"
              description="데이터를 집계중이에요"
              userType={userType}
              orientation="vertical"
            />
          ) : data && data.articles.length > 0 ? (
            <ButtonCard>
              {data.articles.map((article) => (
                <RankingRow
                  key={article.articleId}
                  rank={article.rank}
                  title={article.title}
                  // [임시] cartedUserCount는 '담은 사람 수'인데 문구는 '보고 있어요' — 기획 확인 전
                  subtext={`오늘 ${route} ${person} ${article.cartedUserCount.toLocaleString("ko-KR")}명이 보고 있어요`}
                  isLive
                  hasArrow={false}
                  rankTone={article.rank <= 3 ? "brand" : "mono"}
                  onPress={() => openArticle(article.url)}
                />
              ))}
            </ButtonCard>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
