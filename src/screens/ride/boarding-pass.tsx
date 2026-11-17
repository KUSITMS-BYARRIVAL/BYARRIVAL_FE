import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button/button";
import { Header } from "@/components/header/header";
import { BoardingPassCard } from "@/screens/ride/_components/boarding-pass-card";
import { useRideArticles } from "@/stores/ride-store";

export function BoardingPassScreen() {
  const { top, bottom } = useSafeAreaInsets();
  // 뉴스 탑승하기에서 고른 기사만 노선에 싣는다
  const articles = useRideArticles();
  // 담은 카드를 유지한 채 뉴스 탑승하기로 돌아간다. 알림에서 바로 들어와 스택에 없으면 그 화면으로 바꾼다
  const backToSelect = () => router.dismissTo("/ride/select");

  return (
    <View className="flex-1 bg-grey-100" style={{ paddingTop: top }}>
      <Header title="도착까지" onBack={backToSelect} />
      <ScrollView className="flex-1" contentContainerClassName="p-5">
        <BoardingPassCard from="집" to="회사" articles={articles} />
      </ScrollView>
      <View
        className="gap-3.5 px-5"
        style={{ paddingBottom: Math.max(bottom, 30) }}
      >
        <Button
          label="출발하기"
          color="neutral"
          size="l"
          onPress={() => router.push("/ride/stop")}
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
