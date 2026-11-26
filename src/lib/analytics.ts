import { PostHog } from "posthog-react-native";

const POSTHOG_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY;

// 컴포넌트 밖(query-client · mutation 콜백 · 스토어)에서도 보내려고 훅 대신 모듈 인스턴스를 쓴다
// 키가 없으면(테스트 · 키 없는 로컬) 아무것도 보내지 않는다
export const posthog = new PostHog(POSTHOG_KEY ?? "", {
  host: "https://us.i.posthog.com",
  disabled: !POSTHOG_KEY,
});

export const track = (
  event: string,
  properties?: Parameters<PostHog["capture"]>[1],
) => posthog.capture(event, properties);
