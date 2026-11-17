import type { ConfigContext, ExpoConfig } from "expo/config";

// app.json이 기본 설정이고, 여기서는 환경변수에 따라 달라지는 플러그인만 덧붙인다
// 카카오 네이티브 앱 키는 앱에 들어가는 공개 클라이언트 키다 (시크릿 아님)
const kakaoNativeAppKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  plugins: [
    ...(config.plugins ?? []),
    "expo-apple-authentication",
    [
      "expo-image-picker",
      { photosPermission: "프로필 사진을 바꾸려면 사진 접근 권한이 필요해요." },
    ],
    // 카카오 Android SDK(com.kakao.sdk)는 Maven Central에 없어 카카오 저장소를 추가해야 의존성을 받는다
    [
      "expo-build-properties",
      {
        android: {
          extraMavenRepos: [
            "https://devrepo.kakao.com/nexus/content/groups/public/",
          ],
        },
      },
    ],
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
