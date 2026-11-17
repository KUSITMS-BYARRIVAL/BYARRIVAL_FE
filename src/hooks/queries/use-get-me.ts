import { useQuery } from "@tanstack/react-query";

import { userService } from "@/apis/user-service";
import type { UserMeResponse } from "@/types/user/user.types";

// 화면 밖에서 한 번만 받아올 때(queryClient.fetchQuery)도 같은 키를 쓰도록 내보낸다
export const getMeQuery = {
  queryKey: ["user", "getMe"],
  queryFn: userService.getMe,
};

export function useGetMe() {
  return useQuery<UserMeResponse>(getMeQuery);
}
