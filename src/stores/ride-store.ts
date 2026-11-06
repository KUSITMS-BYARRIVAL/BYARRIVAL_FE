import { create } from "zustand";

type RideState = {
  /** 뉴스 탑승하기에서 고른 기사 제목 (목업 기사에 id가 없어 제목으로 구분한다) */
  selectedTitles: string[];
  toggleArticle: (title: string) => void;
};

export const useRideStore = create<RideState>()((set) => ({
  selectedTitles: [],
  toggleArticle: (title) =>
    set(({ selectedTitles }) => ({
      selectedTitles: selectedTitles.includes(title)
        ? selectedTitles.filter((selected) => selected !== title)
        : [...selectedTitles, title],
    })),
}));
