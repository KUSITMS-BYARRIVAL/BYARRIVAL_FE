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
      {
        photosPermission: "프로필 사진을 바꾸려면 사진 접근 권한이 필요해요.",
        // 사진첩만 쓴다. 기본값이면 영어 카메라·마이크 권한 문구가 들어가 심사에서 지적될 수 있다
        cameraPermission: false,
        microphonePermission: false,
      },
    ],
    // 카카오 Android SDK(com.kakao.sdk)는 Maven Central에 없어 카카오 저장소를 추가해야 의존성을 받는다
    // React Native Firebase는 iOS에서 dynamic frameworks가 필요하다 (static이면 pod install 실패)
    [
      "expo-build-properties",
      {
        // 개발 빌드의 네트워크 인스펙터가 카카오 SDK 요청을 가로채, 로그인 버튼을 누르면 로그인 창이 뜨기 전에 크래시 (Release에는 없음)
        ios: { useFrameworks: "dynamic", networkInspector: false },
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
