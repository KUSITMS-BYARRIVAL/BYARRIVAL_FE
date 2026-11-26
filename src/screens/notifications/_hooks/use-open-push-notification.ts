import { useEffect } from "react";

import { useMarkNotificationRead } from "@/hooks/mutations/use-mark-notification-read";
import { track } from "@/lib/analytics";
import { onPushOpened } from "@/lib/fcm-token";
import { openNotification } from "@/screens/notifications/_helpers";

/** OS 푸시를 눌러 앱이 열리면 그 알림을 읽음 처리하고 알림함 항목을 누를 때와 같은 화면으로 보낸다 */
export function useOpenPushNotification() {
  const { mutate: markRead } = useMarkNotificationRead();

  useEffect(
    () =>
      // notificationId · type 외의 키가 유형별 params
      onPushOpened(({ notificationId, type, ...params }) => {
        track("push_open", { push_type: type ?? null });
        // 서버 data가 숫자가 아니면 잘못된 요청 · 에러 토스트가 되므로 읽음 처리만 건너뛴다
        const id = Number(notificationId);
        if (Number.isInteger(id) && id > 0) markRead(id);
        openNotification(type ?? "", params);
      }),
    [markRead],
  );
}
