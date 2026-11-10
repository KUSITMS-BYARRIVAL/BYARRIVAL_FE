import { create } from "zustand";

// shortcut: 노출 시간이 Figma·사양에 없어 2초로 가정
const TOAST_DURATION_MS = 2000;

type ToastOptions = {
  message: string;
  label?: string;
  onLabelPress?: () => void;
};

type ToastState = {
  toast: ToastOptions | null;
  showToast: (toast: ToastOptions) => void;
  hideToast: () => void;
};

let hideTimer: ReturnType<typeof setTimeout> | undefined;

export const useToastStore = create<ToastState>()((set) => ({
  toast: null,
  // 새 토스트가 오면 이전 것을 바로 교체하고 노출 시간을 다시 센다
  showToast: (toast) => {
    clearTimeout(hideTimer);
    set({ toast });
    hideTimer = setTimeout(() => set({ toast: null }), TOAST_DURATION_MS);
  },
  hideToast: () => {
    clearTimeout(hideTimer);
    set({ toast: null });
  },
}));
