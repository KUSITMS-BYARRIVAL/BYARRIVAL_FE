import { create } from "zustand";

import { NOTIFICATION_GROUPS } from "@/mocks/notification";

const NOTIFICATION_ITEMS = NOTIFICATION_GROUPS.flatMap((group) => group.items);

type NotificationState = {
  hasNewNotification: boolean;
  clearNewNotification: () => void;
  readIds: string[];
  markRead: (id: string) => void;
  markAllRead: () => void;
};

export const useNotificationStore = create<NotificationState>()((set) => ({
  // shortcut: 목데이터에 안 읽은 알림이 있어 true로 시작, API 연결 시 서버 값으로 교체
  hasNewNotification: true,
  clearNewNotification: () => set({ hasNewNotification: false }),
  // shortcut: 읽음 상태는 서버 데이터라 API 연결 시 알림 목록 Query + 읽음 처리 mutation으로 옮기고 여기서 삭제
  readIds: NOTIFICATION_ITEMS.filter((item) => item.isRead).map(
    (item) => item.id,
  ),
  markRead: (id) =>
    set(({ readIds }) => ({
      readIds: readIds.includes(id) ? readIds : [...readIds, id],
    })),
  markAllRead: () =>
    set({ readIds: NOTIFICATION_ITEMS.map((item) => item.id) }),
}));
