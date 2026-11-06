import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  IntroBackgroundIllustration,
  LogoIllustration,
} from "@/assets/illustrations";

// Figma에서 상태바(59px) 아래 로고까지의 거리
const CONTENT_TOP = 79;

// 화면설계서 ONB-01: 탭하면 ONB-02 로그인으로 이동한다.
// 설계서의 "뉴스 시작하기" 버튼은 Figma 최종 디자인에 없어 화면 전체를 누를 수 있게 한다
// TODO: 로그인 토큰이 있으면 인트로를 건너뛰고 홈으로 (인증 연동 시)
export function IntroScreen() {
  const { top } = useSafeAreaInsets();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="도착까지 시작하기"
      className="flex-1 bg-default"
      onPress={() => router.replace("/sign-in")}
    >
      {/* 배경 그라데이션·도시·지하철 그림. 기기 높이가 달라도 아래(선로)를 기준으로 화면을 채운다 */}
      <IntroBackgroundIllustration
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMax slice"
        style={{ position: "absolute" }}
      />
      <View className="gap-5 px-5" style={{ paddingTop: top + CONTENT_TOP }}>
        <LogoIllustration />
        <Text className="text-brand text-body1-sb">
          {"오늘의 컨디션에 맞게\n딱 맞는 뉴스를 큐레이션해드려요"}
        </Text>
      </View>
    </Pressable>
  );
}
