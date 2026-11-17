import { Animated, useAnimatedValue, useWindowDimensions } from "react-native";

import { NewsCard } from "@/screens/ride/_components/news-card";
import type { RideArticle } from "@/screens/ride/_components/stop-article";

// Figma 393 화면에서 카드 315 → 양옆 39px씩 다음 카드가 보인다
const CARD_SIDE_PEEK = 78;
const CARD_GAP = 14;

type CarouselArticle = Pick<
  RideArticle,
  "category" | "label" | "title" | "minutes" | "image"
> & { summary: string[] };

type NewsCarouselProps = {
  articles: CarouselArticle[];
  isSelected: (title: string) => boolean;
  onToggle: (title: string, minutes: number) => void;
  /** 스와이프가 멈춘 뒤 가운데 카드 위치 */
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
      // 투명도는 스크롤 위치를 따라 네이티브에서 바뀌고, 위치 알림은 멈춘 뒤 한 번만 보낸다
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true },
      )}
      onMomentumScrollEnd={(e) =>
        onIndexChange(Math.round(e.nativeEvent.contentOffset.x / interval))
      }
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
