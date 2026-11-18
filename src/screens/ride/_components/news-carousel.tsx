import {
  Animated,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  useAnimatedValue,
  useWindowDimensions,
} from "react-native";

import { CATEGORY_IMAGES, CATEGORY_KEY_BY_ID } from "@/screens/_constants";
import { NewsCard } from "@/screens/ride/_components/news-card";
import type { RouteCard } from "@/types/ride/ride.types";

// Figma 393 화면에서 카드 315 → 양옆 39px씩 다음 카드가 보인다
const CARD_SIDE_PEEK = 78;
const CARD_GAP = 14;

type NewsCarouselProps = {
  cards: RouteCard[];
  /** 처음 가운데 둘 카드 순서 (0부터) */
  initialIndex?: number;
  onToggle: (card: RouteCard) => void;
  /** 가운데 카드 위치가 바뀔 때 (스와이프 도중 절반을 넘으면) */
  onIndexChange: (index: number) => void;
};

/** 가운데 카드만 진하고 양옆 카드가 흐리게 보이는 뉴스 카드 슬라이더 */
export function NewsCarousel({
  cards,
  initialIndex = 0,
  onToggle,
  onIndexChange,
}: NewsCarouselProps) {
  const { width } = useWindowDimensions();
  const cardWidth = width - CARD_SIDE_PEEK;
  const interval = cardWidth + CARD_GAP;
  // 시작 위치에서 스크롤 이벤트가 오기 전에도 가운데 카드가 진하게 보이도록 같은 값으로 시작한다
  const scrollX = useAnimatedValue(initialIndex * interval);

  return (
    <Animated.ScrollView
      horizontal
      snapToInterval={interval}
      decelerationRate="fast"
      contentOffset={{ x: initialIndex * interval, y: 0 }}
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
                cards.length - 1,
              ),
            ),
        },
      )}
      contentContainerStyle={{
        gap: CARD_GAP,
        paddingHorizontal: CARD_SIDE_PEEK / 2,
      }}
    >
      {cards.map((card, i) => (
        <Animated.View
          key={card.articleId}
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
            category={CATEGORY_KEY_BY_ID[card.categoryId]}
            categoryLabel={card.categoryName}
            readMinutes={card.readingMinutes}
            title={card.title}
            aiSummary={card.oneLine}
            // 기사 이미지가 API에 없어 카테고리 이미지 5장 중 하나를 기사마다 고정으로 고른다
            image={CATEGORY_IMAGES[card.categoryId][card.articleId % 5]}
            isSelected={card.carted}
            onPress={() => onToggle(card)}
          />
        </Animated.View>
      ))}
    </Animated.ScrollView>
  );
}
