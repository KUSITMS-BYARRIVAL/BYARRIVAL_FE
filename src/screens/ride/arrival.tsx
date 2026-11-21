import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { type ComponentRef, useEffect, useRef } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { captureRef } from "react-native-view-shot";

import { SmallTalkIcon } from "@/assets/icons";
import { AlarmButton } from "@/screens/_components/alarm-button";
import { Button } from "@/components/button/button";
import { ButtonCard } from "@/components/button-card/button-card";
import { RankingRow } from "@/components/button-card/ranking-row";
import { Header } from "@/components/header/header";
import { LoadingDots } from "@/components/loading-dots/loading-dots";
import { ShareButton } from "@/components/share-button/share-button";
import { useArrive } from "@/hooks/mutations/use-arrive";
import { useGetQuizResult } from "@/hooks/queries/use-get-quiz-result";
import { useGetTodayRoute } from "@/hooks/queries/use-get-today-route";
import { openArticle } from "@/screens/_helpers";
import { useCommuteWords } from "@/screens/_hooks/use-commute-words";
import { ArrivalHero } from "@/screens/ride/_components/arrival-hero";
import { ArrivalResultCard } from "@/screens/ride/_components/arrival-result-card";
import { ArrivalShareCard } from "@/screens/ride/_components/arrival-share-card";
import { useToastStore } from "@/stores/toast-store";

export function ArrivalScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { route, userType } = useCommuteWords();
  const { data: today } = useGetTodayRoute();
  const routeId = today?.route?.routeId;
  const { mutate: arrive, data: arrival } = useArrive();
  // 퀴즈 결과는 완주한 노선만 볼 수 있어 도착 응답을 받은 뒤에 조회한다
  const { data: quizResult } = useGetQuizResult(arrival?.routeId);
  const shareCardRef = useRef<ComponentRef<typeof View>>(null);
  const isSharingRef = useRef(false);

  // 도착 API는 같은 결과를 돌려주므로(멱등) 홈 '오늘 노선 다시 보기'로 다시 들어와도 그대로 부른다
  useEffect(() => {
    if (routeId !== undefined) arrive(routeId);
  }, [routeId, arrive]);

  if (!arrival)
    return (
      <View className="flex-1 bg-grey-100" style={{ paddingTop: top }}>
        <Header title="도착까지" right={<AlarmButton />} />
        {/* 완주 기록 전(또는 실패 — 전역 토스트)에는 결과를 그릴 수 없다 */}
        <LoadingDots className="flex-1" />
      </View>
    );

  const top3 = arrival.top3;

  // 공유 시트를 닫는 건 실패가 아니다 — 캡처 실패 · 공유 불가 기기만 알린다
  const handleShare = async () => {
    // 연타로 공유 시트가 겹쳐 열리지 않게 막는다
    if (isSharingRef.current) return;
    isSharingRef.current = true;
    const showFailToast = () =>
      useToastStore.getState().showToast({ message: "공유하지 못했어요" });
    try {
      if (!(await Sharing.isAvailableAsync())) {
        showFailToast();
        return;
      }
      const uri = await captureRef(shareCardRef, {
        format: "png",
        result: "tmpfile",
      });
      await Sharing.shareAsync(uri, { mimeType: "image/png" });
    } catch {
      showFailToast();
    } finally {
      isSharingRef.current = false;
    }
  };

  return (
    <View className="flex-1 bg-grey-100" style={{ paddingTop: top }}>
      {/* 공유 이미지용 카드 — 캡처하려면 그려져 있어야 해서 화면 밖에 두고 스크린리더에서 숨긴다 */}
      <View
        className="absolute left-[-10000px]"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <ArrivalShareCard
          ref={shareCardRef}
          readCount={arrival.readCount}
          streakDays={arrival.streakDays}
        />
      </View>
      <Header title="도착까지" right={<AlarmButton />} />
      <ScrollView className="flex-1">
        <ArrivalHero userType={userType} />
        <View className="gap-9 p-5">
          <View className="gap-3.5">
            <View className="flex-row items-start justify-between">
              <View className="gap-1">
                {/* TODO: 완주한 경우 문구가 달라진다 (기획 수정 대기) */}
                <Text className="text-strong text-heading1-b">
                  오늘도 해냈다!
                </Text>
                <Text className="text-secondary text-body2-m">
                  {route}을 알차게 보냈어요.
                </Text>
              </View>
              <ShareButton onPress={handleShare} />
            </View>
            <View className="gap-2">
              <ArrivalResultCard
                readCount={arrival.readCount}
                streakDays={arrival.streakDays}
              />
              <Button
                label={
                  quizResult?.finished
                    ? "오늘 퀴즈 결과 보기"
                    : "오늘 읽은 기사, 잘 기억하는지 확인해보기"
                }
                icon="right"
                // 다 풀었으면 퀴즈 화면이 1번부터 고른 답 · 정답 · 해설을 다시 보여준 뒤 결과로 간다
                onPress={() => router.push("/quiz")}
              />
            </View>
          </View>
          <View className="gap-3.5">
            <View className="gap-1">
              <Text className="text-tertiary text-body2-m">
                도착까지 시간이 남으셨다면
              </Text>
              <Text className="text-strong text-title2-sb">
                하나 더 읽어볼까요?
              </Text>
            </View>
            <View className="gap-3.5">
              {/* 집계 실패(null)면 숨긴다. 이번 노선에서 읽은 기사는 백엔드가 뺀다 */}
              {top3?.status === "AGGREGATING" && (
                <ButtonCard title="오늘 다른 사람들이 많이 읽은 뉴스 TOP 3">
                  {/* [임시] 집계 중 모양이 시안에 없어 홈과 같은 문구만 둔다 */}
                  <Text className="px-5 py-4 text-tertiary text-body2-m">
                    데이터를 집계중이에요
                  </Text>
                </ButtonCard>
              )}
              {top3?.status === "RANKED" && top3.articles.length > 0 && (
                <ButtonCard title="오늘 다른 사람들이 많이 읽은 뉴스 TOP 3">
                  {top3.articles.map((article) => (
                    <RankingRow
                      key={article.articleId}
                      rank={article.rank}
                      title={article.title}
                      // [임시] cartedUserCount는 '담은 사람 수'인데 문구는 '읽음' — 기획 확인 전
                      subtext={`${article.categoryName} · ${article.readingMinutes}분 · ${article.cartedUserCount.toLocaleString("ko-KR")}명 읽음`}
                      onPress={() => openArticle(article.url)}
                    />
                  ))}
                </ButtonCard>
              )}
              <Button
                label="스몰토크 확인하기"
                color="neutral-weak"
                leadingIcon={<SmallTalkIcon />}
                onPress={() => router.push("/smalltalk")}
              />
            </View>
          </View>
        </View>
        <View className="px-5" style={{ paddingBottom: Math.max(bottom, 30) }}>
          <Button
            label="홈으로 돌아가기"
            color="neutral"
            size="l"
            onPress={() => router.dismissTo("/")}
          />
        </View>
      </ScrollView>
    </View>
  );
}
