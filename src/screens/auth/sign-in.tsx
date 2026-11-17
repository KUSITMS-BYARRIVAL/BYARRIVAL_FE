import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSocialLogin } from "@/hooks/mutations/use-social-login";
import {
  getAppleToken,
  getKakaoToken,
  isAppleLoginAvailable,
} from "@/lib/social-auth";
import { SocialLoginButton } from "@/screens/auth/_components/social-login-button";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { useToastStore } from "@/stores/toast-store";
import type { SocialLoginRequest } from "@/types/auth/auth.types";

const heroImage = require("@/assets/images/login-hero.jpg");

// Figma 지하철 안 곰 일러스트(393×559) 비율
const HERO_ASPECT_RATIO = 393 / 559;

const SDK_ERROR_MESSAGE = "로그인하지 못했어요. 잠시 후 다시 시도해 주세요.";

/** 소셜 SDK에서 토큰을 받는다. 사용자가 취소하면 null */
async function requestSocialToken(
  provider: SocialLoginRequest["provider"],
): Promise<SocialLoginRequest | null> {
  if (provider === "KAKAO") {
    const token = await getKakaoToken();
    return token ? { provider, token } : null;
  }
  const apple = await getAppleToken();
  return apple
    ? {
        provider,
        token: apple.token,
        ...(apple.authorizationCode && {
          authorizationCode: apple.authorizationCode,
        }),
      }
    : null;
}

export function SignInScreen() {
  const { bottom } = useSafeAreaInsets();
  const { mutate, isPending } = useSocialLogin();
  const completeOnboarding = useOnboardingStore(
    (state) => state.completeOnboarding,
  );
  const showToast = useToastStore((state) => state.showToast);
  // SDK 로그인 창이 떠 있는 동안 버튼을 다시 누르지 못하게 한다
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  // Apple 로그인은 iOS에서만 된다
  const [canUseApple, setCanUseApple] = useState(false);

  useEffect(() => {
    isAppleLoginAvailable()
      .then(setCanUseApple)
      .catch(() => setCanUseApple(false));
  }, []);

  const signIn = async (provider: SocialLoginRequest["provider"]) => {
    setIsAuthorizing(true);
    try {
      const body = await requestSocialToken(provider);
      if (!body) return;
      mutate(body, {
        // TODO: termsAgreed가 false면 약관 화면(ONB-03)으로 — 약관 화면 디자인 전까지는 온보딩으로 보낸다
        onSuccess: ({ onboardingCompleted }) => {
          if (onboardingCompleted) {
            completeOnboarding();
            router.replace("/");
            return;
          }
          // 온보딩 첫 화면이 서버에 저장된 값으로 이어서 진행한다
          router.replace("/nickname");
        },
      });
    } catch {
      showToast({ message: SDK_ERROR_MESSAGE });
    } finally {
      setIsAuthorizing(false);
    }
  };
  const isBusy = isAuthorizing || isPending;

  // 어두운 배경이라 이 화면에 있는 동안만 상태바 글자를 밝게 하고, 떠나면 되돌린다
  useFocusEffect(() => {
    setStatusBarStyle("light");
    return () => setStatusBarStyle("dark");
  });

  return (
    // 작은 화면에서는 일러스트가 커서 로그인 버튼이 밀리므로 스크롤로 닿게 한다
    <ScrollView
      className="flex-1 bg-black"
      contentContainerStyle={{ paddingBottom: bottom }}
      bounces={false}
    >
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
          {canUseApple && (
            <SocialLoginButton
              provider="apple"
              disabled={isBusy}
              onPress={() => signIn("APPLE")}
            />
          )}
          <SocialLoginButton
            provider="kakao"
            disabled={isBusy}
            onPress={() => signIn("KAKAO")}
          />
        </View>
      </View>
    </ScrollView>
  );
}
