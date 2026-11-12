import { create } from "zustand";

type NotificationState = {
  hasNewNotification: boolean;
  clearNewNotification: () => void;
};

export const useNotificationStore = create<NotificationState>()((set) => ({
  // shortcut: 목데이터에 안 읽은 알림이 있어 true로 시작, API 연결 시 서버 값으로 교체
  hasNewNotification: true,
  clearNewNotification: () => set({ hasNewNotification: false }),
}));
