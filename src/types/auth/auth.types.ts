// Swagger 스키마 그대로 (도메인 코드 auth: Auth 태그)

export type SocialProvider = "KAKAO" | "APPLE";

export type SocialLoginRequest = {
  provider: SocialProvider;
  /** 카카오 access token 또는 Apple identity token */
  token: string;
  authorizationCode?: string;
};

export type SocialLoginResponse = {
  userId: number;
  isNewUser: boolean;
  termsAgreed: boolean;
  onboardingCompleted: boolean;
  accessToken: string;
  refreshToken: string;
};
