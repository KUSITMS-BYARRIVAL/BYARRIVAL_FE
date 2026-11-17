import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EditorPickSmalltalkIcon } from "@/assets/icons";
import { Header } from "@/components/header/header";
import { LoadingDots } from "@/components/loading-dots/loading-dots";
import { useSaveSmalltalk } from "@/hooks/mutations/use-save-smalltalk";
import { useUnsaveSmalltalk } from "@/hooks/mutations/use-unsave-smalltalk";
import { useGetTodaySmalltalks } from "@/hooks/queries/use-get-today-smalltalks";
import { EditorPickSmalltalkCard } from "@/screens/_components/editor-pick-smalltalk-card";
import { CATEGORY_KEY_BY_ID } from "@/screens/_constants";

// Figma 에디터픽_스몰토크: 홈 '스몰토크 추천 > 더보기'로 들어오는 오늘의 스몰토크 목록
export function SmalltalkScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { data, isPending } = useGetTodaySmalltalks();
  const saveSmalltalk = useSaveSmalltalk();
  const unsaveSmalltalk = useUnsaveSmalltalk();
  // 서버 응답을 기다리지 않고 북마크를 바로 바꿔 보여준다. 실패하면 되돌린다 (실패 토스트는 전역 처리)
  const [bookmarkOverrides, setBookmarkOverrides] = useState<
    Record<number, boolean>
  >({});
  const smalltalks = data?.smalltalks ?? [];

  const toggleBookmark = (smalltalkId: number, isBookmarked: boolean) => {
    const setBookmarked = (value: boolean) =>
      setBookmarkOverrides((overrides) => ({
        ...overrides,
        [smalltalkId]: value,
      }));
    setBookmarked(!isBookmarked);
    (isBookmarked ? unsaveSmalltalk : saveSmalltalk).mutate(smalltalkId, {
      onError: () => setBookmarked(isBookmarked),
    });
  };

  return (
    <View className="flex-1 bg-default">
      <View className="bg-white" style={{ paddingTop: top }}>
        <Header title="Editor’s Pick" onBack={() => router.back()} />
      </View>
      <ScrollView
        contentContainerClassName="gap-3.5"
        contentContainerStyle={{ paddingBottom: Math.max(bottom, 30) }}
      >
        <View className="gap-2 border-b border-default bg-white p-5">
          <EditorPickSmalltalkIcon />
          <View className="gap-1.5">
            {/* Figma는 22px Bold(140%·-2%)지만 같은 토큰이 없어 홈 인사말처럼 heading2-b(24px·135%)를 쓴다 */}
            <Text
              accessibilityRole="header"
              className="text-primary text-heading2-b"
            >
              오늘 바로 쓰는 스몰토크
            </Text>
            <Text className="text-secondary text-body2-m">
              오늘 뉴스와 관련된, 어색함을 깨는 한마디
            </Text>
          </View>
        </View>
        {isPending ? (
          <LoadingDots className="py-10" />
        ) : smalltalks.length === 0 ? (
          // [임시] Empty UI 시안이 없어 문구만 보여준다 (조회 실패도 전역 토스트 후 여기로)
          <Text className="py-10 text-center text-tertiary text-body2-m">
            오늘의 스몰토크를 준비하고 있어요
          </Text>
        ) : (
          <View className="gap-3.5 px-5">
            {smalltalks.map((smalltalk) => {
              const isBookmarked =
                bookmarkOverrides[smalltalk.smalltalkId] ?? smalltalk.scrapped;
              return (
                <EditorPickSmalltalkCard
                  key={smalltalk.smalltalkId}
                  category={CATEGORY_KEY_BY_ID[smalltalk.categoryId]}
                  categoryLabel={smalltalk.categoryName}
                  newsTitle={smalltalk.articleTitle}
                  question={smalltalk.hook}
                  isBookmarked={isBookmarked}
                  onPress={() => {
                    // 서버가 준 주소라도 https 원문만 연다
                    if (smalltalk.sourceUrl.startsWith("https://"))
                      WebBrowser.openBrowserAsync(smalltalk.sourceUrl);
                  }}
                  onBookmarkPress={() =>
                    toggleBookmark(smalltalk.smalltalkId, isBookmarked)
                  }
                />
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
