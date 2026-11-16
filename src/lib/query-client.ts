import { MutationCache, QueryClient } from "@tanstack/react-query";

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
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.skipToast) return;
      useToastStore.getState().showToast({ message: error.message });
    },
  }),
});
