import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AlarmIcon, SmallTalkIcon } from "@/assets/icons";
import { Button } from "@/components/button/button";
import { ButtonCard } from "@/components/button-card/button-card";
import { RankingRow } from "@/components/button-card/ranking-row";
import { Header } from "@/components/header/header";
import { ShareButton } from "@/components/share-button/share-button";
import {
  ARRIVAL_STREAK_DAYS,
  BOARDING_ARTICLES,
  IS_QUIZ_SOLVED,
  TRENDING_ARTICLES,
} from "@/mocks/ride";
import { ArrivalHero } from "@/screens/ride/_components/arrival-hero";
import { ArrivalResultCard } from "@/screens/ride/_components/arrival-result-card";

export function ArrivalScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { readCount } = useLocalSearchParams<{ readCount?: string }>();

  return (
    <View className="flex-1 bg-grey-100" style={{ paddingTop: top }}>
      {/* TODO: 알림 화면 연결 (UT 범위에서는 동작 없음) */}
      <Header title="도착까지" right={<AlarmIcon />} />
      <ScrollView className="flex-1">
        <ArrivalHero />
        <View className="gap-9 p-5">
          <View className="gap-3.5">
            <View className="flex-row items-start justify-between">
              <View className="gap-2">
                {/* TODO: 완주한 경우 문구가 달라진다 (기획 수정 대기) */}
                <Text className="text-strong text-heading1-b">
                  오늘도 해냈다!
                </Text>
                {/* TODO: 사용자 유형별 문구 (직장인 출근길 · 학생 등굣길 · 기타 이동길) */}
                <Text className="text-secondary text-body2-m">
                  출근길을 알차게 보냈어요.
                </Text>
              </View>
              {/* TODO: 공유 대상이 정해지면 연결 */}
              <ShareButton />
            </View>
            <View className="gap-2">
              <ArrivalResultCard
                readCount={Number(readCount ?? 0)}
                total={BOARDING_ARTICLES.length}
                streakDays={ARRIVAL_STREAK_DAYS}
              />
              <Button
                label={
                  IS_QUIZ_SOLVED
                    ? "오늘 퀴즈 결과 보기"
                    : "오늘 읽은 기사, 잘 기억하는지 확인해보기"
                }
                icon="right"
                onPress={() => router.push("/quiz")}
              />
            </View>
          </View>
          <View className="gap-5">
            <View className="gap-1">
              <Text className="text-tertiary text-body2-m">
                도착까지 시간이 남으셨다면
              </Text>
              <Text className="text-strong text-title2-sb">
                하나 더 읽어볼까요?
              </Text>
            </View>
            <View className="gap-3.5">
              {/* TODO: 이미 읽은 기사 '읽음' 표시 여부 확인 중 (백엔드 필터링 여부) */}
              <ButtonCard title="오늘 다른 사람들이 많이 읽은 뉴스 TOP 3">
                {TRENDING_ARTICLES.map((article, i) => (
                  <RankingRow
                    key={article.url}
                    rank={i + 1}
                    title={article.title}
                    subtext={`${article.label} · ${article.minutes}분 · ${article.readers.toLocaleString()}명 읽음`}
                    onPress={() => WebBrowser.openBrowserAsync(article.url)}
                  />
                ))}
              </ButtonCard>
              <Button
                label="스몰토크 확인하기"
                color="neutral-weak"
                leadingIcon={<SmallTalkIcon />}
                onPress={() => router.push("/smalltalk")}
              />
            </View>
          </View>
        </View>
        <View className="px-5" style={{ paddingBottom: Math.max(bottom, 30) }}>
          <Button
            label="홈으로 돌아가기"
            color="neutral"
            size="l"
            onPress={() => router.dismissTo("/")}
          />
        </View>
      </ScrollView>
    </View>
  );
}
