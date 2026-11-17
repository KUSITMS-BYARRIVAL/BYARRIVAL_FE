import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EditorPickSmalltalkIcon } from "@/assets/icons";
import { Header } from "@/components/header/header";
import { LoadingDots } from "@/components/loading-dots/loading-dots";
import { useGetTodaySmalltalks } from "@/hooks/queries/use-get-today-smalltalks";
import { EditorPickSmalltalkCard } from "@/screens/_components/editor-pick-smalltalk-card";
import { CATEGORY_KEY_BY_ID } from "@/screens/_constants";

// Figma 에디터픽_스몰토크: 홈 '스몰토크 추천 > 더보기'로 들어오는 오늘의 스몰토크 목록
export function SmalltalkScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { data, isPending } = useGetTodaySmalltalks();
  // TODO: 스크랩 API 연결 전까지 서버 값(scrapped) 위에 화면 안에서만 담기 상태를 덮어쓴다
  const [bookmarkOverrides, setBookmarkOverrides] = useState<
    Record<number, boolean>
  >({});
  const smalltalks = data?.smalltalks ?? [];

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
                  // shortcut: 매핑표에 없는 새 카테고리 id는 경제 색으로 보인다, 카테고리가 늘면 CATEGORY_KEY_BY_ID에 추가
                  category={
                    CATEGORY_KEY_BY_ID[smalltalk.categoryId] ?? "economy"
                  }
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
                    setBookmarkOverrides((overrides) => ({
                      ...overrides,
                      [smalltalk.smalltalkId]: !isBookmarked,
                    }))
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
