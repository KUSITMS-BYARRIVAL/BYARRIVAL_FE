import { baseApi } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type {
  Library,
  LibraryParams,
  ScrapStatus,
} from "@/types/scrap/scrap.types";

export const scrapService = {
  getLibrary: async (params: LibraryParams) => {
    const res = await baseApi.get<ApiResponse<Library>>("/scraps", { params });
    return res.data.data;
  },
  delete: async (scrapId: number) => {
    const res = await baseApi.delete<ApiResponse<null>>(`/scraps/${scrapId}`);
    return res.data.data;
  },
  restore: async (scrapId: number) => {
    const res = await baseApi.post<ApiResponse<null>>(
      `/scraps/${scrapId}/restore`,
    );
    return res.data.data;
  },
  saveSmalltalk: async (smalltalkId: number) => {
    const res = await baseApi.put<ApiResponse<ScrapStatus>>(
      `/scraps/smalltalks/${smalltalkId}`,
    );
    return res.data.data;
  },
  unsaveSmalltalk: async (smalltalkId: number) => {
    const res = await baseApi.delete<ApiResponse<ScrapStatus>>(
      `/scraps/smalltalks/${smalltalkId}`,
    );
    return res.data.data;
  },
};
