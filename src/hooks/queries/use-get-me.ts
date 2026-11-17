import { useQuery } from "@tanstack/react-query";

import { userService } from "@/apis/user-service";
import type { UserMeResponse } from "@/types/user/user.types";

export function useGetMe() {
  return useQuery<UserMeResponse>({
    queryKey: ["user", "getMe"],
    queryFn: userService.getMe,
  });
}
