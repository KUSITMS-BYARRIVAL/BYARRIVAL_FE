import { baseApi } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type {
  Smalltalk,
  SmalltalkList,
} from "@/types/smalltalk/smalltalk.types";

export const smalltalkService = {
  getToday: async () => {
    const res = await baseApi.get<ApiResponse<SmalltalkList>>("/smalltalks");
    return res.data.data;
  },
  get: async (smalltalkId: number) => {
    const res = await baseApi.get<ApiResponse<Smalltalk>>(
      `/smalltalks/${smalltalkId}`,
    );
    return res.data.data;
  },
};
