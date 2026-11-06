import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SocialLoginButton } from "@/screens/auth/_components/social-login-button";

const heroImage = require("@/assets/images/login-hero.jpg");

// Figma 지하철 안 곰 일러스트(393×559) 비율
const HERO_ASPECT_RATIO = 393 / 559;

export function SignInScreen() {
  const { bottom } = useSafeAreaInsets();

  // 어두운 배경이라 이 화면에 있는 동안만 상태바 글자를 밝게 하고, 떠나면 되돌린다
  useFocusEffect(() => {
    setStatusBarStyle("light");
    return () => setStatusBarStyle("dark");
  });

  return (
    <View className="flex-1 bg-black" style={{ paddingBottom: bottom }}>
      <Image
        source={heroImage}
        contentFit="cover"
        accessibilityIgnoresInvertColors
        style={{ width: "100%", aspectRatio: HERO_ASPECT_RATIO }}
      />
      <View className="gap-9 pt-5">
        <View className="gap-3.5 px-5">
          <Text
            accessibilityRole="header"
            className="text-on-fill-default text-heading1-b"
          >
            반가워요!
          </Text>
          <Text className="text-on-fill-muted text-body2-m">
            도착까지와 함께 이동길을 더 가치있게 보내요.
          </Text>
        </View>
        <View className="gap-3 px-5">
          {/* TODO: 소셜 로그인 연동 (백엔드 인증 API 명세 확정 후)
              화면설계서 ONB-02: 신규 회원 → ONB-03 약관, 기존 회원 → 홈, 온보딩 미완료 → 중단한 단계
              약관 화면 디자인 전까지는 닉네임 입력으로 바로 이동한다 */}
          <SocialLoginButton
            provider="apple"
            onPress={() => router.push("/nickname")}
          />
          <SocialLoginButton
            provider="kakao"
            onPress={() => router.push("/nickname")}
          />
        </View>
      </View>
    </View>
  );
}
