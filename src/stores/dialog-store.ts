import { create } from "zustand";

type DialogOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  confirmColor?: "brand" | "neutral" | "danger";
  onConfirm: () => void;
  cancelLabel?: string;
  /** 넘기면 취소 버튼이 생겨 버튼 2개가 된다 */
  onCancel?: () => void;
};

type DialogState = {
  // 닫을 때 options를 남겨 둬야 fade-out 동안 내용이 비지 않는다
  options: DialogOptions | null;
  isVisible: boolean;
  openDialog: (options: DialogOptions) => void;
  closeDialog: () => void;
};

export const useDialogStore = create<DialogState>()((set) => ({
  options: null,
  isVisible: false,
  openDialog: (options) => set({ options, isVisible: true }),
  closeDialog: () => set({ isVisible: false }),
}));
