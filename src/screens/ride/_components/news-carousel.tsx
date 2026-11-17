import {
  Animated,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  useAnimatedValue,
  useWindowDimensions,
} from "react-native";

import { NewsCard } from "@/screens/ride/_components/news-card";
import type { RideArticle } from "@/screens/ride/_components/stop-article";

// Figma 393 화면에서 카드 315 → 양옆 39px씩 다음 카드가 보인다
const CARD_SIDE_PEEK = 78;
const CARD_GAP = 14;

// shortcut: summary를 붙인 타입이 stop-article · 테스트에도 따로 있음, API 연동 때 응답 타입 하나로 합친다
type CarouselArticle = Pick<
  RideArticle,
  "category" | "label" | "title" | "minutes" | "image"
> & { summary: string[] };

type NewsCarouselProps = {
  articles: CarouselArticle[];
  isSelected: (title: string) => boolean;
  onToggle: (title: string, minutes: number) => void;
  /** 가운데 카드 위치가 바뀔 때 (스와이프 도중 절반을 넘으면) */
  onIndexChange: (index: number) => void;
};

/** 가운데 카드만 진하고 양옆 카드가 흐리게 보이는 뉴스 카드 슬라이더 */
export function NewsCarousel({
  articles,
  isSelected,
  onToggle,
  onIndexChange,
}: NewsCarouselProps) {
  const { width } = useWindowDimensions();
  const cardWidth = width - CARD_SIDE_PEEK;
  const interval = cardWidth + CARD_GAP;
  const scrollX = useAnimatedValue(0);

  return (
    <Animated.ScrollView
      horizontal
      snapToInterval={interval}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      // 투명도는 네이티브에서 따라가고, 위치는 카드가 절반을 넘는 순간 알린다 (멈출 때까지 기다리면 진행 바가 늦다)
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        {
          useNativeDriver: true,
          // 같은 값이면 부모 setState가 다시 그리지 않는다
          listener: (e: NativeSyntheticEvent<NativeScrollEvent>) =>
            // iOS 양끝 바운스로 offset이 범위를 넘을 수 있어 가둔다
            onIndexChange(
              Math.min(
                Math.max(
                  Math.round(e.nativeEvent.contentOffset.x / interval),
                  0,
                ),
                articles.length - 1,
              ),
            ),
        },
      )}
      contentContainerStyle={{
        gap: CARD_GAP,
        paddingHorizontal: CARD_SIDE_PEEK / 2,
      }}
    >
      {articles.map(
        ({ category, label, title, minutes, image, summary }, i) => (
          <Animated.View
            key={title}
            style={{
              width: cardWidth,
              opacity: scrollX.interpolate({
                inputRange: [
                  (i - 1) * interval,
                  i * interval,
                  (i + 1) * interval,
                ],
                outputRange: [0.2, 1, 0.2],
                extrapolate: "clamp",
              }),
            }}
          >
            <NewsCard
              category={category}
              categoryLabel={label}
              readMinutes={minutes}
              title={title}
              aiSummary={summary[0] ?? ""}
              image={image}
              isSelected={isSelected(title)}
              onPress={() => onToggle(title, minutes)}
            />
          </Animated.View>
        ),
      )}
    </Animated.ScrollView>
  );
}
