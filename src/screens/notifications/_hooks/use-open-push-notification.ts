import { useEffect } from "react";

import { useMarkNotificationRead } from "@/hooks/mutations/use-mark-notification-read";
import { onPushOpened } from "@/lib/fcm-token";
import { openNotification } from "@/screens/notifications/_helpers";

/** OS 푸시를 눌러 앱이 열리면 그 알림을 읽음 처리하고 알림함 항목을 누를 때와 같은 화면으로 보낸다 */
export function useOpenPushNotification() {
  const { mutate: markRead } = useMarkNotificationRead();

  useEffect(
    () =>
      // notificationId · type 외의 키가 유형별 params
      onPushOpened(({ notificationId, type, ...params }) => {
        if (notificationId) markRead(Number(notificationId));
        openNotification(type ?? "", params);
      }),
    [markRead],
  );
}
