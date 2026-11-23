import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { onForegroundPush } from "@/lib/fcm-token";

/** 앱을 보고 있을 때 푸시가 오면 알림함 · 안 읽은 개수(알림 아이콘 빨간 점)를 다시 받는다 */
export function useRefreshNotificationsOnPush() {
  const queryClient = useQueryClient();

  useEffect(
    () =>
      onForegroundPush(() =>
        queryClient.invalidateQueries({ queryKey: ["notification"] }),
      ),
    [queryClient],
  );
}
