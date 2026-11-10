import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Toast } from "@/components/toast/toast";
import { useToastStore } from "@/stores/toast-store";

// Figma 알림 화면 기준: 헤더(h-11) 바로 아래
const HEADER_HEIGHT = 44;

/** 루트에 한 번 두고, 어디서든 showToast로 띄운다 */
export function ToastHost() {
  const { top } = useSafeAreaInsets();
  const { toast, hideToast } = useToastStore();
  if (!toast) return null;

  const { onLabelPress } = toast;
  return (
    <View
      className="absolute inset-x-[17.5px]"
      style={{ top: top + HEADER_HEIGHT }}
    >
      <Toast
        {...toast}
        onLabelPress={
          onLabelPress &&
          (() => {
            hideToast();
            onLabelPress();
          })
        }
      />
    </View>
  );
}
