import { useInfiniteQuery } from "@tanstack/react-query";

import { notificationService } from "@/apis/notification-service";

const PAGE_SIZE = 20;

export function useGetNotifications() {
  return useInfiniteQuery({
    queryKey: ["notification", "getNotifications"],
    queryFn: ({ pageParam }) =>
      notificationService.getNotifications({
        cursor: pageParam,
        size: PAGE_SIZE,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
  });
}
