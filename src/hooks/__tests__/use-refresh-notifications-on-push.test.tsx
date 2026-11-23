import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { onForegroundPush } from "@/lib/fcm-token";

import { useRefreshNotificationsOnPush } from "../use-refresh-notifications-on-push";

jest.mock("@/lib/fcm-token", () => ({ onForegroundPush: jest.fn() }));

const unsubscribe = jest.fn();
let queryClient: QueryClient;

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

beforeEach(() => {
  jest.clearAllMocks();
  queryClient = new QueryClient();
  jest.mocked(onForegroundPush).mockReturnValue(unsubscribe);
});

describe("useRefreshNotificationsOnPush", () => {
  it("앱을 보는 중에 푸시가 오면 알림 쿼리만 다시 받게 무효화한다", async () => {
    const invalidate = jest.spyOn(queryClient, "invalidateQueries");
    await renderHook(() => useRefreshNotificationsOnPush(), { wrapper });

    jest.mocked(onForegroundPush).mock.calls[0]![0]();

    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["notification"] });
  });

  it("언마운트하면 푸시 구독을 해제한다", async () => {
    const { unmount } = await renderHook(
      () => useRefreshNotificationsOnPush(),
      { wrapper },
    );

    await unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});
