/* global jest */
// Jest는 .env를 읽지 않는다. 단위 테스트는 실제 서버를 부르지 않으므로 가짜 주소로 채운다
process.env.EXPO_PUBLIC_API_BASE_URL = "https://api.test";

// PostHog SDK는 네이티브 저장소를 쓰므로 테스트에서는 호출 기록만 남기는 가짜로 바꾼다
jest.mock("posthog-react-native", () => ({
  PostHog: jest.fn().mockImplementation(() => ({
    capture: jest.fn(),
    screen: jest.fn(),
    identify: jest.fn(),
    reset: jest.fn(),
  })),
  PostHogProvider: ({ children }) => children,
}));
