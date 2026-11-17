type SocialAuth = typeof import("../social-auth");

const mockInit = jest.fn();
const mockKakaoLogin = jest.fn();
const mockSignIn = jest.fn();

jest.mock("@react-native-kakao/core", () => ({
  initializeKakaoSDK: (...args: unknown[]) => mockInit(...args),
}));
jest.mock("@react-native-kakao/user", () => ({
  login: (...args: unknown[]) => mockKakaoLogin(...args),
}));
jest.mock("expo-apple-authentication", () => ({
  signInAsync: (...args: unknown[]) => mockSignIn(...args),
  isAvailableAsync: jest.fn(),
  AppleAuthenticationScope: { EMAIL: 1 },
}));

const TEST_KEY = "test-app-key";
let auth: SocialAuth;

beforeEach(() => {
  jest.clearAllMocks();
  // 모듈 전역 kakaoInitialized를 테스트마다 초기화한다
  jest.resetModules();
  auth = require("../social-auth") as SocialAuth;
  process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY = TEST_KEY;
  mockInit.mockResolvedValue(undefined);
});

afterEach(() => {
  delete process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;
});

describe("getKakaoToken", () => {
  it("앱 키로 SDK를 초기화하고 로그인한 accessToken을 반환한다", async () => {
    mockKakaoLogin.mockResolvedValue({ accessToken: "kakao-token" });

    await expect(auth.getKakaoToken()).resolves.toBe("kakao-token");
    expect(mockInit).toHaveBeenCalledWith(TEST_KEY);
  });

  it("앱 키가 없으면 SDK를 호출하지 않고 에러를 던진다", async () => {
    delete process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;

    await expect(auth.getKakaoToken()).rejects.toThrow();
    expect(mockInit).not.toHaveBeenCalled();
  });

  it.each(["Cancelled", "AccessDenied"])(
    "사용자가 취소하면(%s) 에러 없이 null을 반환한다",
    async (code) => {
      mockKakaoLogin.mockRejectedValue({ code });

      await expect(auth.getKakaoToken()).resolves.toBeNull();
    },
  );

  it("취소가 아닌 에러는 그대로 던진다", async () => {
    const error = { code: "Unknown" };
    mockKakaoLogin.mockRejectedValue(error);

    await expect(auth.getKakaoToken()).rejects.toBe(error);
  });

  it("초기화가 실패하면 다음 호출에서 다시 초기화한다", async () => {
    mockInit.mockRejectedValueOnce(new Error("init failed"));
    mockKakaoLogin.mockResolvedValue({ accessToken: "kakao-token" });

    await expect(auth.getKakaoToken()).rejects.toThrow("init failed");
    await expect(auth.getKakaoToken()).resolves.toBe("kakao-token");
    expect(mockInit).toHaveBeenCalledTimes(2);
  });
});

describe("getAppleToken", () => {
  it("정상이면 identityToken과 authorizationCode를 반환한다", async () => {
    mockSignIn.mockResolvedValue({
      identityToken: "apple-token",
      authorizationCode: "code-1",
    });

    await expect(auth.getAppleToken()).resolves.toEqual({
      token: "apple-token",
      authorizationCode: "code-1",
    });
  });

  it("사용자가 취소하면 null을 반환한다", async () => {
    mockSignIn.mockRejectedValue({ code: "ERR_REQUEST_CANCELED" });

    await expect(auth.getAppleToken()).resolves.toBeNull();
  });

  it("identityToken이 없으면 에러를 던진다", async () => {
    mockSignIn.mockResolvedValue({
      identityToken: null,
      authorizationCode: "code-1",
    });

    await expect(auth.getAppleToken()).rejects.toThrow();
  });
});
