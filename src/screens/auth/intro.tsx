import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  IntroBackgroundIllustration,
  LogoIllustration,
} from "@/assets/illustrations";

// Figma에서 상태바(59px) 아래 로고까지의 거리
const CONTENT_TOP = 79;

// TODO: 인트로에서 로그인 화면으로 넘어가는 방식(자동 전환·탭) 기획 확인 후 연결
export function IntroScreen() {
  const { top } = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-default">
      {/* 배경 그라데이션·도시·지하철 그림. 기기 높이가 달라도 아래(선로)를 기준으로 화면을 채운다 */}
      <IntroBackgroundIllustration
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMax slice"
        style={{ position: "absolute" }}
      />
      <View className="gap-5 px-5" style={{ paddingTop: top + CONTENT_TOP }}>
        <View
          accessible
          accessibilityRole="header"
          accessibilityLabel="도착까지"
        >
          <LogoIllustration />
        </View>
        <Text className="text-brand text-body1-sb">
          {"오늘의 컨디션에 맞게\n딱 맞는 뉴스를 큐레이션해드려요"}
        </Text>
      </View>
    </View>
  );
}
