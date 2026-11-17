import { baseApi } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { Library, LibraryParams } from "@/types/scrap/scrap.types";

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
};
