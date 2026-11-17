import { useQuery } from "@tanstack/react-query";

import { smalltalkService } from "@/apis/smalltalk-service";
import type { Smalltalk } from "@/types/smalltalk/smalltalk.types";

export function useGetSmalltalk(smalltalkId: number) {
  return useQuery<Smalltalk>({
    queryKey: ["smalltalk", "get", smalltalkId],
    queryFn: () => smalltalkService.get(smalltalkId),
  });
}
