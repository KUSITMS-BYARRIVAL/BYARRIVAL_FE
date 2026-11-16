import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EditorPickSmalltalkIcon } from "@/assets/icons";
import { Header } from "@/components/header/header";
import { EDITOR_PICK_SMALLTALKS } from "@/mocks/smalltalk";
import { EditorPickSmalltalkCard } from "@/screens/_components/editor-pick-smalltalk-card";

// Figma 에디터픽_스몰토크: 홈 '스몰토크 추천 > 더보기'로 들어오는 오늘의 스몰토크 목록
export function SmalltalkScreen() {
  const { top, bottom } = useSafeAreaInsets();
  // TODO: 북마크 API 연결 전까지 화면 안에서만 담기 상태를 둔다
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const toggleBookmark = (id: string) =>
    setBookmarkedIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id],
    );

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
        <View className="gap-3.5 px-5">
          {EDITOR_PICK_SMALLTALKS.map((smalltalk) => (
            <EditorPickSmalltalkCard
              key={smalltalk.id}
              category={smalltalk.category}
              categoryLabel={smalltalk.label}
              newsTitle={smalltalk.newsTitle}
              question={smalltalk.question}
              isBookmarked={bookmarkedIds.includes(smalltalk.id)}
              onPress={() => WebBrowser.openBrowserAsync(smalltalk.url)}
              onBookmarkPress={() => toggleBookmark(smalltalk.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
