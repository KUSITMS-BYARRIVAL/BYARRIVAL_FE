import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  type ScrollViewInstance,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BookmarkIcon, ShareIcon } from "@/assets/icons";
import { Button } from "@/components/button/button";
import { Header } from "@/components/header/header";
import { ProgressStepperSmall } from "@/components/progress-stepper/progress-stepper-small";
import { BOARDING_ARTICLES } from "@/mocks/ride";
import { StopArticle } from "@/screens/ride/_components/stop-article";
import { SEMANTIC } from "@/theme/colors";

const TOTAL = BOARDING_ARTICLES.length;

export function StopScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const pagerRef = useRef<ScrollViewInstance>(null);
  const [index, setIndex] = useState(0);
  const isLast = index === TOTAL - 1;

  const handleNext = () => {
    // TODO: 도착(arrival) 화면이 생기면 그쪽으로 이동
    if (isLast) return router.dismissTo("/");
    pagerRef.current?.scrollTo({ x: (index + 1) * width });
    setIndex(index + 1);
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: top }}>
      <Header
        title={`${index + 1}/${TOTAL}번째 정거장`}
        // TODO: '운행을 멈출까요? 읽은 기록은 저장돼요' 확인 모달 (모달 전역 관리 후)
        onBack={() => router.dismissTo("/")}
        right={
          <>
            {/* TODO: OS 공유 시트 (UT 범위에서는 동작 없음) */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="공유하기"
              hitSlop={10}
            >
              <ShareIcon color={SEMANTIC.icon["on-fill-muted"]} />
            </Pressable>
            {/* TODO: 보관함에 담고 '보관함에 담았어요' 토스트 (UT 범위에서는 동작 없음) */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="북마크"
              hitSlop={10}
            >
              <BookmarkIcon color={SEMANTIC.icon["on-fill-muted"]} />
            </Pressable>
          </>
        }
      />
      <ScrollView className="flex-1">
        <View className="mx-5 mt-5 gap-2 rounded-md bg-card-green px-5 py-2.5">
          <ProgressStepperSmall
            tone="brand"
            total={TOTAL}
            current={index + 1}
          />
          <View className="flex-row items-center justify-between">
            <Text className="text-tertiary text-caption1-m">출발</Text>
            <Text className="text-primary text-caption1-m">
              {index + 1}번 정거장 정차 중
            </Text>
            <Text className="text-tertiary text-caption1-m">종착</Text>
          </View>
        </View>
        <ScrollView
          ref={pagerRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) =>
            setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
          }
        >
          {BOARDING_ARTICLES.map((article) => (
            <View key={article.url} className="p-5" style={{ width }}>
              <StopArticle
                article={article}
                onOriginalPress={() => WebBrowser.openBrowserAsync(article.url)}
              />
            </View>
          ))}
        </ScrollView>
      </ScrollView>
      <View className="px-5" style={{ paddingBottom: Math.max(bottom, 30) }}>
        <Button
          label={isLast ? "도착까지" : `다음 정거장 ${index + 2}/${TOTAL}`}
          color="neutral-weak"
          size="l"
          onPress={handleNext}
        />
      </View>
    </View>
  );
}
