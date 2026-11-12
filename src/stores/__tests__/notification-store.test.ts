import { useNotificationStore } from "../notification-store";

describe("useNotificationStore", () => {
  it("clearNewNotification을 호출하면 새 알림 표시가 꺼진다", () => {
    useNotificationStore.setState({ hasNewNotification: true });
    useNotificationStore.getState().clearNewNotification();
    expect(useNotificationStore.getState().hasNewNotification).toBe(false);
  });
});
