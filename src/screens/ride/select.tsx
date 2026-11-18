import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button/button";
import { Header } from "@/components/header/header";
import { LoadingDots } from "@/components/loading-dots/loading-dots";
import { ProgressBar } from "@/components/progress-bar/progress-bar";
import { Toast } from "@/components/toast/toast";
import { useAddCard } from "@/hooks/mutations/use-add-card";
import { useBoard } from "@/hooks/mutations/use-board";
import { useRemoveCard } from "@/hooks/mutations/use-remove-card";
import { useSaveCursor } from "@/hooks/mutations/use-save-cursor";
import { useGetTodayRoute } from "@/hooks/queries/use-get-today-route";
import {
  ADD_TOAST_MESSAGE,
  OVER_LIMIT_TOAST_MESSAGE,
} from "@/screens/ride/_constants";
import { NewsCarousel } from "@/screens/ride/_components/news-carousel";
import { SelectCoachMark } from "@/screens/ride/_components/select-coach-mark";
import type { Route, RouteCard } from "@/types/ride/ride.types";

// 서버에 저장 필드가 없어 기기에 남긴다 (토큰과 무관한 UI 플래그)
const COACH_SEEN_KEY = "ride-select-coach-seen";
// shortcut: 노출 시간이 Figma·사양에 없어 전역 토스트와 같은 2초로 가정
const TOAST_DURATION_MS = 2000;

export function SelectScreen() {
  const { top } = useSafeAreaInsets();
  const { data: today } = useGetTodayRoute();
  const route = today?.route;

  return (
    <View className="flex-1 bg-grey-100" style={{ paddingTop: top }}>
      <Header title="뉴스 탑승하기" onBack={router.back} />
      {/* 노선을 받기 전(또는 조회 실패 — 전역 토스트)에는 카드를 그릴 수 없다 */}
      {route ? (
        <SelectContent route={route} />
      ) : (
        <LoadingDots className="flex-1" />
      )}
    </View>
  );
}

// 시작 위치(lastViewedCardOrder)를 처음 한 번만 쓰도록 노선을 받은 뒤에 마운트한다
function SelectContent({ route }: { route: Route }) {
  const { bottom } = useSafeAreaInsets();
  const { routeId, cards, cart } = route;
  // 시작 위치는 처음 한 번만 정한다 — 바뀌면 캐러셀이 스크롤 도중 그 위치로 다시 옮겨져 카드 사이에 멈춘다
  const [initialIndex] = useState((route.lastViewedCardOrder ?? 1) - 1);
  const [index, setIndex] = useState(initialIndex);
  // 화면을 떠날 때(정리 함수) 마지막 위치를 읽는다
  const indexRef = useRef(index);
  const { mutate: addCard, isPending: isAdding } = useAddCard();
  const { mutate: removeCard, isPending: isRemoving } = useRemoveCard();
  const { mutate: saveCursor } = useSaveCursor();
  const { mutate: board, isPending: isBoarding } = useBoard();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [isCoachVisible, setIsCoachVisible] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(COACH_SEEN_KEY)
      .then((seen) => setIsCoachVisible(!seen))
      // 읽기 실패(키체인 오류 등) 시 안내 없이 바로 쓰게 둔다
      .catch(() => {});
    return () => clearTimeout(toastTimer.current);
  }, []);

  // 스와이프마다 보내지 않고 화면을 떠날 때(다음 화면 · 뒤로가기) 한 번 저장한다
  useFocusEffect(
    useCallback(
      () => () => saveCursor({ routeId, cardOrder: indexRef.current + 1 }),
      [routeId, saveCursor],
    ),
  );

  const handleIndexChange = (next: number) => {
    indexRef.current = next;
    setIndex(next);
  };

  const closeCoach = () => {
    setIsCoachVisible(false);
    void SecureStore.setItemAsync(COACH_SEEN_KEY, "1");
  };

  const showToast = (message: string) => {
    clearTimeout(toastTimer.current);
    setToastMessage(message);
    toastTimer.current = setTimeout(
      () => setToastMessage(null),
      TOAST_DURATION_MS,
    );
  };

  const toggle = ({ articleId, carted, addable }: RouteCard) => {
    // 응답으로 노선이 바뀌기 전에 또 누르면 담기 · 빼기가 엇갈린다
    if (isAdding || isRemoving) return;
    if (carted) return removeCard({ routeId, articleId });
    if (!addable) return showToast(OVER_LIMIT_TOAST_MESSAGE);
    // 뺄 때는 토스트를 띄우지 않는다
    addCard(
      { routeId, articleId },
      { onSuccess: () => showToast(ADD_TOAST_MESSAGE) },
    );
  };
  // 바는 넘긴 카드 순서만큼 차오르고(담기와 무관), 시간은 담은 기사의 읽는 시간 합계 (탑승권 '예상 시간'과 같은 값)
  const progress = index / Math.max(cards.length - 1, 1);

  return (
    <>
      <View className="flex-row items-center gap-2 p-5">
        <Text className="text-primary text-caption1-m">
          {cart.totalMinutes}분
        </Text>
        <ProgressBar progress={progress} className="flex-1" />
        <Text className="text-secondary text-caption1-r">
          {Math.round(progress * 100)}%
        </Text>
      </View>
      <ScrollView className="flex-1" contentContainerClassName="gap-3.5 py-11">
        <NewsCarousel
          cards={cards}
          initialIndex={initialIndex}
          onToggle={toggle}
          onIndexChange={handleIndexChange}
        />
        <Text className="text-center text-tertiary text-caption1-m">
          {index + 1}/{cards.length}
        </Text>
      </ScrollView>
      <View className="px-5" style={{ paddingBottom: Math.max(bottom, 30) }}>
        {toastMessage && (
          <View className="pointer-events-none absolute inset-x-5 -top-[60px]">
            <Toast message={toastMessage} />
          </View>
        )}
        <Button
          label="시작하기"
          color="neutral"
          size="l"
          disabled={!cart.startable || isBoarding}
          onPress={() =>
            board(routeId, {
              onSuccess: () => router.push("/ride/boarding-pass"),
            })
          }
        />
      </View>
      {isCoachVisible && <SelectCoachMark onClose={closeCoach} />}
    </>
  );
}
