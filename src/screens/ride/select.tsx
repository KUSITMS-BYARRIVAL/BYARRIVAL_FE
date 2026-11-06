import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  ScrollView,
  type ScrollViewInstance,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button/button";
import { Header } from "@/components/header/header";
import { ProgressBar } from "@/components/progress-bar/progress-bar";
import { SELECT_ARTICLES } from "@/mocks/ride";
import { getTotalMinutes } from "@/screens/ride/_components/boarding-pass-card";
import { NewsCard } from "@/screens/ride/_components/news-card";
import { SummaryCard } from "@/screens/ride/_components/summary-card";
import { useRideStore } from "@/stores/ride-store";

export function SelectScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const pagerRef = useRef<ScrollViewInstance>(null);
  const selectedTitles = useRideStore((state) => state.selectedTitles);
  const toggleArticle = useRideStore((state) => state.toggleArticle);
  const selected = SELECT_ARTICLES.filter(({ title }) =>
    selectedTitles.includes(title),
  );
  // 고른 기사 수만큼 차오르고, 시간은 고른 기사의 예상 독서 시간 합계 (탑승권 '예상 시간'과 같은 값)
  const progress = selected.length / SELECT_ARTICLES.length;

  return (
    <View className="flex-1 bg-grey-100" style={{ paddingTop: top }}>
      <Header title="뉴스 탑승하기" onBack={router.back} />
      <ScrollView className="flex-1">
        <View className="mx-5 mt-5 flex-row items-center gap-2 rounded-full bg-card-white px-3 py-2">
          <Text className="text-primary text-caption1-m">
            {getTotalMinutes(selected)}분
          </Text>
          <ProgressBar progress={progress} className="flex-1" />
          <Text className="text-secondary text-caption1-r">
            {Math.round(progress * 100)}%
          </Text>
        </View>
        {/* 뉴스 카드와 AI 요약이 함께 넘어가도록 한 페이지에 묶는다 */}
        {/* QA: 지나간 기사로는 돌아가지 않는다. 왼쪽으로 끌면 현재 기사 위치로 되돌린다 */}
        <ScrollView
          ref={pagerRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(e) => {
            if (e.nativeEvent.contentOffset.x < index * width) {
              pagerRef.current?.scrollTo({ x: index * width, animated: false });
            }
          }}
          onMomentumScrollEnd={(e) =>
            setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
          }
        >
          {SELECT_ARTICLES.map(
            ({ category, label, title, minutes, image, summary }) => (
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
                  image={image}
                  isSelected={selectedTitles.includes(title)}
                  onPress={() => toggleArticle(title)}
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
          disabled={selected.length === 0}
          onPress={() => router.push("/ride/boarding-pass")}
        />
      </View>
    </View>
  );
}
