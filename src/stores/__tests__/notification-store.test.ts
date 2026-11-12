import { useNotificationStore } from "../notification-store";

describe("useNotificationStore", () => {
  beforeEach(() => {
    useNotificationStore.setState({ hasNewNotification: true, readIds: [] });
  });

  it("clearNewNotification을 호출하면 새 알림 표시가 꺼진다", () => {
    useNotificationStore.getState().clearNewNotification();
    expect(useNotificationStore.getState().hasNewNotification).toBe(false);
  });

  it("markRead는 같은 알림을 두 번 읽어도 한 번만 기록한다", () => {
    useNotificationStore.getState().markRead("1");
    useNotificationStore.getState().markRead("1");
    expect(useNotificationStore.getState().readIds).toEqual(["1"]);
  });

  it("markAllRead를 호출하면 목데이터의 모든 알림이 읽음이 된다", () => {
    useNotificationStore.getState().markAllRead();
    expect(useNotificationStore.getState().readIds).toEqual([
      "1",
      "2",
      "3",
      "4",
    ]);
  });
});
