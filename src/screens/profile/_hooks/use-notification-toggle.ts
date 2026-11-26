import { useEffect } from "react";
import { AppState, Linking } from "react-native";

import { useUpdateNotificationPermission } from "@/hooks/mutations/use-update-notification-permission";
import { useUpdateNotificationSettings } from "@/hooks/mutations/use-update-notification-settings";
import { useGetNotificationSettings } from "@/hooks/queries/use-get-notification-settings";
import { track } from "@/lib/analytics";
import {
  getNotificationPermission,
  requestNotificationPermission,
} from "@/lib/notification-permission";
import { useDialogStore } from "@/stores/dialog-store";

/** 마이 > 알림 토글. OS 권한이 허용이고 서버 수신 설정(ACTIVITY)이 켜져 있어야 켜짐 */
export function useNotificationToggle() {
  const { data } = useGetNotificationSettings();
  const {
    mutate: updateSettings,
    isPending,
    variables,
  } = useUpdateNotificationSettings();
  const { mutate: savePermission } = useUpdateNotificationPermission();
  const openDialog = useDialogStore((state) => state.openDialog);
  const isReady = data !== undefined;
  const savedPermission = data?.permission;

  // 휴대폰 설정에서 권한을 바꾸고 돌아올 수 있어 화면에 올 때 · 앱이 앞으로 올 때 서버 값과 맞춘다
  useEffect(() => {
    if (!isReady) return;
    const sync = () =>
      getNotificationPermission()
        .then(({ permission }) => {
          if (permission !== savedPermission) savePermission(permission);
        })
        .catch(() => undefined);
    sync();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") sync();
    });
    return () => subscription.remove();
  }, [isReady, savedPermission, savePermission]);

  // 저장 응답을 기다리는 동안에도 누른 값을 바로 보여준다
  const isActivityOn = isPending
    ? variables.settings[0].enabled
    : (data?.settings.find(({ category }) => category === "ACTIVITY")
        ?.enabled ?? false);

  const toggle = async (isOn: boolean) => {
    // 켤 때도 수신 설정부터 켠다 — 휴대폰 설정에서 권한을 허용하고 돌아오면 바로 켜진 상태가 되게
    updateSettings({ settings: [{ category: "ACTIVITY", enabled: isOn }] });
    if (!isOn) return;
    try {
      const { permission, canAskAgain } = await getNotificationPermission();
      if (permission === "GRANTED") return;
      // iOS는 한 번, Android 13+는 두 번 거부하면 팝업이 다시 뜨지 않는다
      if (!canAskAgain) {
        return openDialog({
          title: "알림 권한이 꺼져 있어요",
          description: "휴대폰 설정에서 도착까지 알림을\n허용해 주세요.",
          confirmLabel: "이동",
          onConfirm: () => void Linking.openSettings(),
          cancelLabel: "취소",
          onCancel: () => undefined,
        });
      }
      const requested = await requestNotificationPermission();
      track("push_permission_result", {
        result: requested === "GRANTED" ? "granted" : "denied",
        source: "profile",
      });
      savePermission(requested);
    } catch {
      // 권한 모듈이 없는 옛 개발 빌드 — 수신 설정만 바뀐다
    }
  };

  return {
    isOn: savedPermission === "GRANTED" && isActivityOn,
    isReady,
    toggle,
  };
}
