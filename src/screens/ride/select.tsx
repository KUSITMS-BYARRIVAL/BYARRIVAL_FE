import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  type ScrollViewInstance,
  Text,
  useAnimatedValue,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button/button";
import { Header } from "@/components/header/header";
import { ProgressBar } from "@/components/progress-bar/progress-bar";
import { EXTRA_ARTICLES, SELECT_ARTICLES } from "@/mocks/ride";
import { getTotalMinutes } from "@/screens/ride/_components/boarding-pass-card";
import { NewsCard } from "@/screens/ride/_components/news-card";
import { SummaryCard } from "@/screens/ride/_components/summary-card";
import { useRideStore, useSelectedArticles } from "@/stores/ride-store";

export function SelectScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  // 보딩패스 '다른 뉴스 더 탑승시키기'로 들어오면 추가 기사를 보여주고, 시작하기를 누르면 탑승권으로 돌아간다
  const isExtra = useLocalSearchParams<{ extra?: string }>().extra === "1";
  const articles = isExtra ? EXTRA_ARTICLES : SELECT_ARTICLES;
  const [index, setIndex] = useState(0);
  const pagerRef = useRef<ScrollViewInstance>(null);
  const scrollX = useAnimatedValue(0);
  const toggleArticle = useRideStore((state) => state.toggleArticle);
  const selected = useSelectedArticles();
  // 다른 뉴스 더 탑승시키기는 UT용 화면이라 고른 기사를 이 화면에서만 기억한다. 나가면 사라지고 탑승권·정거장에는 반영하지 않는다
  const [extraTitles, setExtraTitles] = useState<string[]>([]);
  const extraSelected = EXTRA_ARTICLES.filter(({ title }) =>
    extraTitles.includes(title),
  );
  const toggle = (title: string) =>
    isExtra
      ? setExtraTitles((prev) =>
          prev.includes(title)
            ? prev.filter((t) => t !== title)
            : [...prev, title],
        )
      : toggleArticle(title);
  const isSelected = (title: string) =>
    (isExtra ? extraSelected : selected).some((a) => a.title === title);
  // QA: 지나간 기사로는 돌아가지 않는다. 왼쪽으로 끌면 현재 기사 위치로 되돌린다
  const lockBackSwipe = (e: {
    nativeEvent: { contentOffset: { x: number } };
  }) => {
    if (e.nativeEvent.contentOffset.x < index * width) {
      pagerRef.current?.scrollTo({ x: index * width, animated: false });
    }
  };
  // 바는 넘긴 카드 순서만큼 차오르고(선택과 무관), 시간은 고른 기사의 예상 독서 시간 합계 (탑승권 '예상 시간'과 같은 값)
  const progress = index / Math.max(articles.length - 1, 1);

  return (
    <View className="flex-1 bg-grey-100" style={{ paddingTop: top }}>
      <Header title="뉴스 탑승하기" onBack={router.back} />
      <ScrollView className="flex-1">
        <View className="mx-5 mt-5 flex-row items-center gap-2 rounded-full bg-card-white px-3 py-2">
          <Text className="text-primary text-caption1-m">
            {getTotalMinutes(selected) + getTotalMinutes(extraSelected)}분
          </Text>
          <ProgressBar progress={progress} className="flex-1" />
          <Text className="text-secondary text-caption1-r">
            {Math.round(progress * 100)}%
          </Text>
        </View>
        {/* 뉴스 카드와 AI 요약이 함께 넘어가도록 한 페이지에 묶는다 */}
        <ScrollView
          ref={pagerRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(e) => {
            // 카드 연출은 JS에서 스크롤 위치를 넘겨 계산한다 (카드 7장이라 충분히 가볍다)
            scrollX.setValue(e.nativeEvent.contentOffset.x);
            lockBackSwipe(e);
          }}
          onMomentumScrollEnd={(e) =>
            setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
          }
        >
          {articles.map(
            ({ category, label, title, minutes, image, summary }, i) => {
              const page = i * width;
              const incoming = [page - width, page];
              const outgoing = [page, page + width];
              // 고르지 않은 카드는 넘길 때 작아지고 기울며 흐려져 버려지는 느낌을 준다
              const discard = !isSelected(title);
              // 앞 카드가 버려질 때만 이 카드가 제자리(뒤)에서 커지며 올라온다.
              // 앞 카드를 골랐으면 처음처럼 옆에서 밀려 들어온다
              const rise = i > 0 && !isSelected(articles[i - 1].title);
              return (
                <Animated.View
                  key={title}
                  className="gap-3.5 px-5 pb-5 pt-6"
                  style={{
                    width,
                    // 빠져나가는 카드가 올라오는 카드 위에 보이도록 앞 카드를 위에 쌓는다
                    zIndex: articles.length - i,
                    opacity: scrollX.interpolate({
                      inputRange: [...incoming, outgoing[1]],
                      outputRange: [rise ? 0 : 1, 1, discard ? 0 : 1],
                      extrapolate: "clamp",
                    }),
                    transform: [
                      {
                        translateX: scrollX.interpolate({
                          inputRange: incoming,
                          outputRange: [rise ? -width : 0, 0],
                          extrapolate: "clamp",
                        }),
                      },
                      {
                        scale: scrollX.interpolate({
                          inputRange: [...incoming, outgoing[1]],
                          outputRange: [rise ? 0.9 : 1, 1, discard ? 0.8 : 1],
                          extrapolate: "clamp",
                        }),
                      },
                      {
                        rotate: scrollX.interpolate({
                          inputRange: outgoing,
                          outputRange: ["0deg", discard ? "-12deg" : "0deg"],
                          extrapolate: "clamp",
                        }),
                      },
                    ],
                  }}
                >
                  <NewsCard
                    category={category}
                    categoryLabel={label}
                    readMinutes={minutes}
                    title={title}
                    image={image}
                    isSelected={!discard}
                    onPress={() => toggle(title)}
                  />
                  <SummaryCard points={summary} />
                </Animated.View>
              );
            },
          )}
        </ScrollView>
      </ScrollView>
      <View className="px-5" style={{ paddingBottom: Math.max(bottom, 30) }}>
        <Button
          label="시작하기"
          color="neutral"
          size="l"
          disabled={!isExtra && selected.length === 0}
          onPress={() =>
            isExtra ? router.back() : router.push("/ride/boarding-pass")
          }
        />
      </View>
    </View>
  );
}
