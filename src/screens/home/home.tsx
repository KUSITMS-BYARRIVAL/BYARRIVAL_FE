import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SubwaySideIcon } from "@/assets/icons";
import { AlarmButton } from "@/screens/_components/alarm-button";
import { LogoHeader } from "@/screens/_components/logo-header";
import { Button } from "@/components/button/button";
import { LoadingDots } from "@/components/loading-dots/loading-dots";
import { useGetHome } from "@/hooks/queries/use-get-home";
import { useGetMe } from "@/hooks/queries/use-get-me";
import { useGetStatsStreak } from "@/hooks/queries/use-get-stats-streak";
import { CommuterCountCard } from "@/screens/home/_components/commuter-count-card";
import { EditorPickSection } from "@/screens/home/_components/editor-pick-section";
import { StreakCard } from "@/screens/home/_components/streak-card";
import { TrendingSection } from "@/screens/home/_components/trending-section";
import { CATEGORY_KEY_BY_ID } from "@/screens/_constants";
import { getRideButton } from "@/screens/home/_helpers";
import { openArticle, toPopularChipLabel } from "@/screens/_helpers";
import { useCommuteWords } from "@/screens/_hooks/use-commute-words";

export function HomeScreen() {
  const { top } = useSafeAreaInsets();
  const home = useGetHome();
  const me = useGetMe();
  const streak = useGetStatsStreak();
  const { commute, route, person, userType } = useCommuteWords();
  const isPending = home.isPending || me.isPending || streak.isPending;
  const nickname = me.data?.nickname ?? "";
  const rideButton = getRideButton(home.data?.todayRoute ?? null);
  const popular = home.data?.popular;
  const smalltalk = home.data?.smalltalks?.[0];
  const { refetch: refetchHome } = home;
  const { refetch: refetchStreak } = streak;
  // 탭은 마운트된 채 남아 탑승을 마치고 돌아와도 다시 받지 않는다. 처음 포커스는 마운트 조회와 합친다(cancelRefetch: false)
  useFocusEffect(
    useCallback(() => {
      refetchHome({ cancelRefetch: false });
      refetchStreak({ cancelRefetch: false });
    }, [refetchHome, refetchStreak]),
  );

  return (
    <View className="flex-1 bg-default" style={{ paddingTop: top }}>
      <LogoHeader right={<AlarmButton />} />
      {isPending ? (
        <LoadingDots className="flex-1" />
      ) : (
        <ScrollView className="flex-1" contentContainerClassName="gap-9 p-5">
          <View className="gap-3.5">
            <View className="gap-2">
              {/* Figma는 22px Bold(140%·-2%)지만 같은 토큰이 없어 heading2-b(24px·135%)를 쓴다 */}
              <Text className="text-primary text-heading2-b">
                {nickname}님 좋은 아침이에요!
              </Text>
              <Text className="text-secondary text-body2-m">
                오늘도 우리 모두 {commute} 중이에요
              </Text>
            </View>
            <StreakCard
              onPress={() => router.navigate("/my")}
              nickname={nickname}
              route={route}
              userType={userType}
              streakDays={home.data?.streakDays ?? 0}
              longestDays={streak.data?.longestStreak ?? 0}
            />
            {/* [임시] 값은 '오늘 앱을 쓴 회원 수'인데 문구는 '지금 {출근}하는 사람' — 기획 확인 전 */}
            {home.data?.todayVisitorCount != null && (
              <CommuterCountCard
                count={home.data.todayVisitorCount}
                commute={commute}
              />
            )}
            <Button
              label={rideButton.label}
              size="l"
              color="neutral"
              leadingIcon={<SubwaySideIcon width={30} height={30} />}
              disabled={!rideButton.onPress}
              onPress={rideButton.onPress}
            />
          </View>
          {popular && popular.length > 0 && (
            <TrendingSection
              route={route}
              person={person}
              userType={userType}
              chips={popular.map((chip) => ({
                label: toPopularChipLabel(chip.jobGroup),
                isAggregating: chip.status === "AGGREGATING",
                // [임시] cartedUserCount는 '담은 사람 수'인데 문구는 '보고 있어요' — 기획 확인 전
                articles: chip.articles.map((article) => ({
                  title: article.title,
                  url: article.url,
                  viewers: article.cartedUserCount,
                })),
              }))}
              onSeeAllPress={(chipIndex) =>
                router.push({
                  pathname: "/trending",
                  params: { chip: chipIndex },
                })
              }
              onArticlePress={openArticle}
            />
          )}
          {smalltalk && (
            <EditorPickSection
              smalltalk={{
                category: CATEGORY_KEY_BY_ID[smalltalk.categoryId],
                categoryLabel: smalltalk.categoryName,
                newsTitle: smalltalk.articleTitle,
                question: smalltalk.hook,
              }}
              onMorePress={() => router.push("/smalltalk")}
              onSmalltalkPress={() => openArticle(smalltalk.sourceUrl)}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
}
