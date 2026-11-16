import { initializeKakaoSDK } from "@react-native-kakao/core";
import { login as kakaoLogin } from "@react-native-kakao/user";
import * as AppleAuthentication from "expo-apple-authentication";

// 사용자가 로그인 창을 닫거나 동의를 거부한 경우 — 에러로 알리지 않고 조용히 끝낸다
const CANCEL_CODES = new Set([
  "Cancelled", // 카카오 (iOS·Android 공통 reason 이름)
  "AccessDenied", // 카카오 동의 화면에서 취소
  "ERR_REQUEST_CANCELED", // Apple
]);

const isCancel = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  CANCEL_CODES.has(String(error.code));

let kakaoInitialized: Promise<void> | null = null;

/** 카카오 access token. 취소하면 null */
export async function getKakaoToken(): Promise<string | null> {
  const appKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;
  if (!appKey)
    throw new Error("EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY가 .env에 없습니다.");
  try {
    // 초기화가 실패하면 다음 시도에서 다시 초기화한다
    kakaoInitialized ??= initializeKakaoSDK(appKey).catch((error) => {
      kakaoInitialized = null;
      throw error;
    });
    await kakaoInitialized;
    const { accessToken } = await kakaoLogin();
    return accessToken;
  } catch (error) {
    if (isCancel(error)) return null;
    throw error;
  }
}

/** Apple identity token과 authorization code. 취소하면 null (iOS 전용) */
export async function getAppleToken(): Promise<{
  token: string;
  authorizationCode: string | null;
} | null> {
  try {
    const { identityToken, authorizationCode } =
      await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });
    if (!identityToken) throw new Error("Apple identity token이 없습니다.");
    return { token: identityToken, authorizationCode };
  } catch (error) {
    if (isCancel(error)) return null;
    throw error;
  }
}

export const isAppleLoginAvailable = AppleAuthentication.isAvailableAsync;
