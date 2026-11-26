import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

import { track } from "@/lib/analytics";
import { useToastStore } from "@/stores/toast-store";

const MAX_RETRY_COUNT = 2;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 4xx는 다시 보내도 결과가 같으므로 네트워크 · 5xx만 재시도한다
      retry: (failureCount, error) =>
        failureCount < MAX_RETRY_COUNT &&
        (error.status === null || error.status >= 500),
    },
  },
  // shortcut: 에러 화면 디자인이 없어 조회 실패도 토스트로 알린다, 에러 화면이 생기면 그 화면 쿼리에 meta.skipToast
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.skipToast) return;
      track("error_view", { code: error.code });
      useToastStore.getState().showToast({ message: error.message });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.skipToast) return;
      track("error_view", { code: error.code });
      useToastStore.getState().showToast({ message: error.message });
    },
  }),
});
