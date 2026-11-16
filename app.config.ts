import type { ConfigContext, ExpoConfig } from "expo/config";

// app.json이 기본 설정이고, 여기서는 환경변수에 따라 달라지는 플러그인만 덧붙인다
// 카카오 네이티브 앱 키는 앱에 들어가는 공개 클라이언트 키다 (시크릿 아님)
const kakaoNativeAppKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  plugins: [
    ...(config.plugins ?? []),
    "expo-apple-authentication",
    // 키 없이 넣으면 플러그인이 에러를 던져, 키가 없는 환경(CI 등)에서는 빼고 실행한다
    ...(kakaoNativeAppKey
      ? [
          [
            "@react-native-kakao/core",
            {
              nativeAppKey: kakaoNativeAppKey,
              android: { authCodeHandlerActivity: true },
              ios: { handleKakaoOpenUrl: true },
            },
          ] as [string, unknown],
        ]
      : []),
  ],
});
