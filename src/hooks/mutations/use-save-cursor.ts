import { useMutation, useQueryClient } from "@tanstack/react-query";

import { rideService } from "@/apis/ride-service";

export function useSaveCursor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rideService.saveCursor,
    // 다음에 뉴스 탑승하기를 열 때 저장한 위치(lastViewedCardOrder)에서 시작하게 한다
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["ride", "getToday"] }),
    // 화면을 떠나면서 보내는 요청이라 실패를 알려도 할 수 있는 게 없다 (위치만 처음부터 열린다)
    meta: { skipToast: true },
  });
}
