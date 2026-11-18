import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button/button";
import { Header } from "@/components/header/header";
import { LoadingDots } from "@/components/loading-dots/loading-dots";
import { useDepart } from "@/hooks/mutations/use-depart";
import { useReturnToCardSelection } from "@/hooks/mutations/use-return-to-card-selection";
import { useGetTodayRoute } from "@/hooks/queries/use-get-today-route";
import { useCommuteWords } from "@/screens/_hooks/use-commute-words";
import { BoardingPassCard } from "@/screens/ride/_components/boarding-pass-card";

export function BoardingPassScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { data: today } = useGetTodayRoute();
  const route = today?.route;
  const { destination } = useCommuteWords();
  const { mutate: depart, isPending: isDeparting } = useDepart();
  const { mutate: returnToCardSelection } = useReturnToCardSelection();
  const hasSentDepartRef = useRef(false);
  const routeId = route?.routeId;

  // 버튼 · iOS 스와이프 · Android 뒤로 버튼 어느 쪽으로 나가도(스택에서 빠지면) 서버를 카드 선택 단계로 되돌린다 (출발 요청 후 제외)
  useEffect(() => {
    if (routeId === undefined) return;
    return () => {
      if (!hasSentDepartRef.current) returnToCardSelection(routeId);
    };
  }, [routeId, returnToCardSelection]);

  // 담은 카드를 유지한 채 뉴스 탑승하기로 돌아간다. 알림에서 바로 들어와 스택에 없으면 그 화면으로 바꾼다
  const backToSelect = () => router.dismissTo("/ride/select");

  const handleDepart = () => {
    if (routeId === undefined) return;
    // 응답 전에 나가도 되돌리기 요청이 출발과 엇갈리지 않게 보내는 순간부터 막는다 (실패하면 다시 푼다)
    hasSentDepartRef.current = true;
    depart(routeId, {
      // 출발하면 노선이 고정되므로 뒤로 가도 탑승권으로 돌아오지 않게 바꾼다
      onSuccess: () => router.replace("/ride/stop"),
      onError: () => {
        hasSentDepartRef.current = false;
      },
    });
  };

  // 담은 순서가 정거장 순서
  const cards = (route?.cards ?? [])
    .filter(({ carted }) => carted)
    .sort((a, b) => (a.cartOrder ?? 0) - (b.cartOrder ?? 0));

  return (
    <View className="flex-1 bg-grey-100" style={{ paddingTop: top }}>
      <Header title="도착까지" onBack={backToSelect} />
      {/* 노선을 받기 전(또는 조회 실패 — 전역 토스트)에는 탑승권을 그릴 수 없다 */}
      {route ? (
        <ScrollView className="flex-1" contentContainerClassName="p-5">
          <BoardingPassCard
            from="집"
            to={destination}
            cards={cards}
            totalMinutes={route.cart.totalMinutes}
          />
        </ScrollView>
      ) : (
        <LoadingDots className="flex-1" />
      )}
      <View
        className="gap-3.5 px-5"
        style={{ paddingBottom: Math.max(bottom, 30) }}
      >
        <Button
          label="출발하기"
          color="neutral"
          size="l"
          disabled={!route || isDeparting}
          onPress={handleDepart}
        />
        <Button
          label="다른 뉴스 더 탑승시키기"
          color="neutral-weak"
          size="l"
          onPress={backToSelect}
        />
      </View>
    </View>
  );
}
