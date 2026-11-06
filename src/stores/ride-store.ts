import { create } from "zustand";

import { SELECT_ARTICLES } from "@/mocks/ride";

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

/**
 * 오늘 노선에 실린 기사 (보딩패스 · 정거장 · 도착).
 * 홈 '이어서 탑승하기'처럼 고르지 않고 들어오면 후보 전체를 싣는다
 */
export function useRideArticles() {
  const selectedTitles = useRideStore((state) => state.selectedTitles);
  const selected = SELECT_ARTICLES.filter(({ title }) =>
    selectedTitles.includes(title),
  );
  return selected.length > 0 ? selected : SELECT_ARTICLES;
}
