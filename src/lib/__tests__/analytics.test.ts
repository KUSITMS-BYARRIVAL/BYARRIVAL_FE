const ORIGINAL_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY;

// env를 바꾼 뒤 모듈을 새로 로드한다. isolateModules 안에서 mock도 새로 만들어지므로 같은 안에서 함께 꺼낸다
const loadAnalytics = (key: string | undefined) => {
  if (key === undefined) delete process.env.EXPO_PUBLIC_POSTHOG_KEY;
  else process.env.EXPO_PUBLIC_POSTHOG_KEY = key;

  let result!: {
    PostHog: jest.Mock;
    analytics: typeof import("../analytics");
  };
  jest.isolateModules(() => {
    result = {
      PostHog: require("posthog-react-native").PostHog,
      analytics: require("../analytics"),
    };
  });
  return result;
};

describe("analytics", () => {
  afterEach(() => {
    if (ORIGINAL_KEY === undefined) delete process.env.EXPO_PUBLIC_POSTHOG_KEY;
    else process.env.EXPO_PUBLIC_POSTHOG_KEY = ORIGINAL_KEY;
  });

  it("키가 없으면 비활성화 상태로 만든다", () => {
    const { PostHog } = loadAnalytics(undefined);

    expect(PostHog).toHaveBeenCalledWith("", {
      host: "https://us.i.posthog.com",
      disabled: true,
    });
  });

  it("키가 빈 문자열이어도 비활성화 상태로 만든다", () => {
    const { PostHog } = loadAnalytics("");

    expect(PostHog).toHaveBeenCalledWith("", {
      host: "https://us.i.posthog.com",
      disabled: true,
    });
  });

  it("키가 있으면 그 키와 US host로 활성화한다", () => {
    const { PostHog } = loadAnalytics("phc_test");

    expect(PostHog).toHaveBeenCalledWith("phc_test", {
      host: "https://us.i.posthog.com",
      disabled: false,
    });
  });

  describe("track", () => {
    it("이벤트명과 속성을 capture에 그대로 전달한다", () => {
      const { analytics } = loadAnalytics("phc_test");

      analytics.track("article_read", { articleId: 1 });

      expect(analytics.posthog.capture).toHaveBeenCalledWith("article_read", {
        articleId: 1,
      });
    });

    it("속성이 없으면 undefined로 전달한다", () => {
      const { analytics } = loadAnalytics("phc_test");

      analytics.track("app_open");

      expect(analytics.posthog.capture).toHaveBeenCalledWith(
        "app_open",
        undefined,
      );
    });
  });
});
