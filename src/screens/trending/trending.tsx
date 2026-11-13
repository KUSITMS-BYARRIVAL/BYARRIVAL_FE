import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ButtonCard } from "@/components/button-card/button-card";
import { RankingRow } from "@/components/button-card/ranking-row";
import { Chip } from "@/components/chip/chip";
import { Header } from "@/components/header/header";
import {
  IS_TRENDING_READY,
  TRENDING_TOP10,
  TRENDING_UPDATED_AT,
} from "@/mocks/ride";
import { MY_PROFILE } from "@/mocks/profile";
import { AchievementCard } from "@/screens/_components/achievement-card";
import { COMMUTE_WORDS } from "@/screens/_constants";

type TrendingScope = "jobGroup" | "all";

export function TrendingScreen() {
  const { top } = useSafeAreaInsets();
  const [scope, setScope] = useState<TrendingScope>("jobGroup");
  const { route, person } = COMMUTE_WORDS[MY_PROFILE.userType];

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
              {IS_TRENDING_READY
                ? `LIVE · 오늘 ${TRENDING_UPDATED_AT} 기준`
                : "LIVE · 첫 순위를 집계하고 있어요"}
            </Text>
          </View>
          <View className="flex-row gap-2 px-5">
            <Chip
              label={`내 직군 · ${MY_PROFILE.jobGroup}`}
              selected={scope === "jobGroup"}
              onPress={() => setScope("jobGroup")}
            />
            <Chip
              label="전체"
              selected={scope === "all"}
              onPress={() => setScope("all")}
            />
          </View>
        </View>
        <View className="px-5">
          {IS_TRENDING_READY ? (
            <ButtonCard>
              {TRENDING_TOP10[scope].map((article, i) => (
                <RankingRow
                  key={article.url}
                  rank={i + 1}
                  title={article.title}
                  subtext={`오늘 ${route} ${person} ${article.viewers.toLocaleString("ko-KR")}명이 보고 있어요`}
                  isLive
                  hasArrow={false}
                  rankTone={i < 3 ? "brand" : "mono"}
                  onPress={() => WebBrowser.openBrowserAsync(article.url)}
                />
              ))}
            </ButtonCard>
          ) : (
            <AchievementCard
              title="축하합니다! 당신은 1등 갓생러"
              description="데이터를 집계중이에요"
              orientation="vertical"
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
