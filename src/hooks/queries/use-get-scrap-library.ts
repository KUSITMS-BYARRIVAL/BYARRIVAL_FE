import { useQuery } from "@tanstack/react-query";

import { scrapService } from "@/apis/scrap-service";
import type { Library, LibraryParams } from "@/types/scrap/scrap.types";

export function useGetScrapLibrary(params: LibraryParams) {
  return useQuery<Library>({
    queryKey: ["scrap", "getLibrary", params],
    queryFn: () => scrapService.getLibrary(params),
  });
}
