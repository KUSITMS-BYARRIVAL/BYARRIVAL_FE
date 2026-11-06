import { render, screen } from "@testing-library/react-native";

import { useOnboardingStore } from "@/stores/onboarding-store";

// src/app 안에 두면 테스트 파일도 라우트로 잡혀서 밖에 둔다
import AppLayout from "@/app/(app)/_layout";

jest.mock("expo-router", () => {
  const { Text: MockText } = jest.requireActual("react-native");
  return {
    Redirect: ({ href }: { href: string }) => (
      <MockText>redirect:{href}</MockText>
    ),
    Stack: () => <MockText>stack</MockText>,
  };
});

const setDev = (value: boolean) => {
  (globalThis as unknown as { __DEV__: boolean }).__DEV__ = value;
};

afterEach(() => setDev(true));

describe("AppLayout", () => {
  it("배포 빌드에서 온보딩 전이면 인트로로 보낸다", async () => {
    setDev(false);
    useOnboardingStore.setState({ isOnboarded: false });
    await render(<AppLayout />);
    expect(screen.getByText("redirect:/intro")).toBeOnTheScreen();
  });

  it("온보딩을 마쳤으면 화면을 그대로 보여준다", async () => {
    setDev(false);
    useOnboardingStore.setState({ isOnboarded: true });
    await render(<AppLayout />);
    expect(screen.getByText("stack")).toBeOnTheScreen();
  });

  it("개발 중에는 온보딩 전이어도 막지 않는다", async () => {
    useOnboardingStore.setState({ isOnboarded: false });
    await render(<AppLayout />);
    expect(screen.getByText("stack")).toBeOnTheScreen();
  });
});
