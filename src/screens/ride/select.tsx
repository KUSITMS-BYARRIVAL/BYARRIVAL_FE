import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button/button";
import { Header } from "@/components/header/header";
import { ProgressBar } from "@/components/progress-bar/progress-bar";
import { Toast } from "@/components/toast/toast";
import { EXTRA_ARTICLES, SELECT_ARTICLES, TARGET_MINUTES } from "@/mocks/ride";
import { getTotalMinutes } from "@/screens/ride/_components/boarding-pass-card";
import {
  canAddToCart,
  isCartStartable,
} from "@/screens/ride/_components/helpers";
import { NewsCarousel } from "@/screens/ride/_components/news-carousel";
import { SelectCoachMark } from "@/screens/ride/_components/select-coach-mark";
import { useRideStore, useSelectedArticles } from "@/stores/ride-store";

// 서버에 저장 필드가 없어 기기에 남긴다 (토큰과 무관한 UI 플래그)
const COACH_SEEN_KEY = "ride-select-coach-seen";
// shortcut: 노출 시간이 Figma·사양에 없어 전역 토스트와 같은 2초로 가정
const TOAST_DURATION_MS = 2000;

export function SelectScreen() {
  const { top, bottom } = useSafeAreaInsets();
  // 보딩패스 '다른 뉴스 더 탑승시키기'로 들어오면 추가 기사를 보여주고, 시작하기를 누르면 탑승권으로 돌아간다
  const isExtra = useLocalSearchParams<{ extra?: string }>().extra === "1";
  const articles = isExtra ? EXTRA_ARTICLES : SELECT_ARTICLES;
  const [index, setIndex] = useState(0);
  const toggleArticle = useRideStore((state) => state.toggleArticle);
  const selected = useSelectedArticles();
  // 다른 뉴스 더 탑승시키기는 UT용 화면이라 고른 기사를 이 화면에서만 기억한다. 나가면 사라지고 탑승권·정거장에는 반영하지 않는다
  const [extraTitles, setExtraTitles] = useState<string[]>([]);
  const extraSelected = EXTRA_ARTICLES.filter(({ title }) =>
    extraTitles.includes(title),
  );
  const isSelected = (title: string) =>
    (isExtra ? extraSelected : selected).some((a) => a.title === title);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [isCoachVisible, setIsCoachVisible] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(COACH_SEEN_KEY).then((seen) =>
      setIsCoachVisible(!seen),
    );
    return () => clearTimeout(toastTimer.current);
  }, []);

  const closeCoach = () => {
    setIsCoachVisible(false);
    void SecureStore.setItemAsync(COACH_SEEN_KEY, "1");
  };

  const totalMinutes =
    getTotalMinutes(selected) + getTotalMinutes(extraSelected);
  const isStartable = isCartStartable(
    totalMinutes,
    articles.filter((a) => !isSelected(a.title)).map((a) => a.minutes),
    TARGET_MINUTES,
  );

  const toggle = (title: string, minutes: number) => {
    if (!isSelected(title)) {
      // shortcut: T×120% 초과 안내 문구가 시안에 없어 담기만 막는다, 시안 나오면 안내 추가
      if (!canAddToCart(totalMinutes, minutes, TARGET_MINUTES)) return;
      // 뺄 때는 토스트를 띄우지 않는다
      clearTimeout(toastTimer.current);
      setIsToastVisible(true);
      toastTimer.current = setTimeout(
        () => setIsToastVisible(false),
        TOAST_DURATION_MS,
      );
    }
    if (!isExtra) return toggleArticle(title);
    setExtraTitles((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };
  // 바는 넘긴 카드 순서만큼 차오르고(선택과 무관), 시간은 고른 기사의 예상 독서 시간 합계 (탑승권 '예상 시간'과 같은 값)
  const progress = index / Math.max(articles.length - 1, 1);

  return (
    <View className="flex-1 bg-grey-100" style={{ paddingTop: top }}>
      <Header title="뉴스 탑승하기" onBack={router.back} />
      <View className="flex-row items-center gap-2 p-5">
        <Text className="text-primary text-caption1-m">{totalMinutes}분</Text>
        <ProgressBar progress={progress} className="flex-1" />
        <Text className="text-secondary text-caption1-r">
          {Math.round(progress * 100)}%
        </Text>
      </View>
      <ScrollView className="flex-1" contentContainerClassName="gap-3.5 py-11">
        <NewsCarousel
          articles={articles}
          isSelected={isSelected}
          onToggle={toggle}
          onIndexChange={setIndex}
        />
        <Text className="text-center text-tertiary text-caption1-m">
          {index + 1}/{articles.length}
        </Text>
      </ScrollView>
      <View className="px-5" style={{ paddingBottom: Math.max(bottom, 30) }}>
        {isToastVisible && (
          <View className="pointer-events-none absolute inset-x-5 -top-[60px]">
            <Toast message="1정거장이 추가되었어요" />
          </View>
        )}
        <Button
          label="시작하기"
          color="neutral"
          size="l"
          disabled={!isExtra && !isStartable}
          onPress={() =>
            isExtra ? router.back() : router.push("/ride/boarding-pass")
          }
        />
      </View>
      {isCoachVisible && <SelectCoachMark onClose={closeCoach} />}
    </View>
  );
}
