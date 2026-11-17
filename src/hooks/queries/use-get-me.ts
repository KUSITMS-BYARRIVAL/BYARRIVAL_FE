import { useQuery } from "@tanstack/react-query";

import { userService } from "@/apis/user-service";
import type { UserMeResponse } from "@/types/user/user.types";

// 화면 밖에서 한 번만 받아올 때(queryClient.fetchQuery)도 같은 키를 쓰도록 내보낸다
export const getMeQuery = {
  queryKey: ["user", "getMe"],
  queryFn: userService.getMe,
};

export function useGetMe() {
  return useQuery<UserMeResponse>({
    ...getMeQuery,
    // 내 정보는 거의 바뀌지 않아 화면마다 다시 받지 않는다. 수정 mutation은 성공 응답으로 캐시를 바꾼다
    staleTime: Infinity,
  });
}
