import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { scrapService } from "@/apis/scrap-service";
import type { Library, LibraryParams } from "@/types/scrap/scrap.types";

export function useGetScrapLibrary(params: LibraryParams) {
  return useQuery<Library>({
    queryKey: ["scrap", "getLibrary", params],
    queryFn: () => scrapService.getLibrary(params),
    // 보관함 탭을 바꿀 때 새 응답이 올 때까지 이전 응답의 탭 개수(counts)를 유지해 탭이 깜빡이지 않게 한다
    placeholderData: keepPreviousData,
  });
}
