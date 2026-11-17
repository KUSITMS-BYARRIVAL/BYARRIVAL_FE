import { useQuery } from "@tanstack/react-query";

import { userService } from "@/apis/user-service";
import type { Me } from "@/types/user/user.types";

export function useGetMe() {
  return useQuery<Me>({
    queryKey: ["user", "getMe"],
    queryFn: userService.getMe,
    // 내 정보는 거의 바뀌지 않아 화면마다 다시 받지 않는다. 수정 mutation 성공 시 이 키를 invalidate할 것
    staleTime: Infinity,
  });
}
