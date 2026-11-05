import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button/button";
import { Header } from "@/components/header/header";
import { ProgressBar } from "@/components/progress-bar/progress-bar";
import { BOARDING_ARTICLES, SELECT_ARTICLES } from "@/mocks/ride";
import { getTotalMinutes } from "@/screens/ride/_components/boarding-pass-card";
import { NewsCard } from "@/screens/ride/_components/news-card";
import { SummaryCard } from "@/screens/ride/_components/summary-card";

// 탑승권 카드(boarding-pass-card)의 기사 읽는 시간 합계 함수 — 탑승권 '예상 시간'과 같은 값
const BOARDING_MINUTES = getTotalMinutes(BOARDING_ARTICLES);

export function SelectScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const progress = index / Math.max(SELECT_ARTICLES.length - 1, 1);

  return (
    <View className="flex-1 bg-grey-100" style={{ paddingTop: top }}>
      <Header title="뉴스 탑승하기" onBack={router.back} />
      <ScrollView className="flex-1">
        <View className="mx-5 mt-5 flex-row items-center gap-2 rounded-full bg-card-white px-3 py-2">
          <Text className="text-primary text-caption1-m">
            {BOARDING_MINUTES + SELECT_ARTICLES[index].minutes}분
          </Text>
          <ProgressBar progress={progress} className="flex-1" />
          <Text className="text-secondary text-caption1-r">
            {Math.round(progress * 100)}%
          </Text>
        </View>
        {/* 뉴스 카드와 AI 요약이 함께 넘어가도록 한 페이지에 묶는다 */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) =>
            setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
          }
        >
          {SELECT_ARTICLES.map(
            ({ category, label, title, minutes, imageUrl, summary }) => (
              <View
                key={title}
                className="gap-3.5 px-5 pb-5 pt-6"
                style={{ width }}
              >
                <NewsCard
                  category={category}
                  categoryLabel={label}
                  readMinutes={minutes}
                  title={title}
                  imageUrl={imageUrl}
                />
                <SummaryCard points={summary} />
              </View>
            ),
          )}
        </ScrollView>
      </ScrollView>
      <View className="px-5" style={{ paddingBottom: Math.max(bottom, 30) }}>
        <Button
          label="시작하기"
          color="neutral"
          size="l"
          // TODO: 보고 있는 기사를 노선에 추가하고, 탑승권 복귀 후 토스트 표시 (추후 작업)
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}
