import { useQuery } from "@tanstack/react-query";

import { smalltalkService } from "@/apis/smalltalk-service";
import type { SmalltalkList } from "@/types/smalltalk/smalltalk.types";

export function useGetTodaySmalltalks() {
  return useQuery<SmalltalkList>({
    queryKey: ["smalltalk", "getToday"],
    queryFn: smalltalkService.getToday,
  });
}
