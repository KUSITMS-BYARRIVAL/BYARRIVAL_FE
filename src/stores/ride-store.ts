import { create } from "zustand";

import { EXTRA_ARTICLES, SELECT_ARTICLES } from "@/mocks/ride";

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

// 고를 수 있는 기사 전체 (뉴스 탑승하기 후보 + 다른 뉴스 더 탑승시키기)
const ALL_ARTICLES = [...SELECT_ARTICLES, ...EXTRA_ARTICLES];

/** 고른 기사 (화면에 보이는 순서대로) */
export function useSelectedArticles() {
  const selectedTitles = useRideStore((state) => state.selectedTitles);
  return ALL_ARTICLES.filter(({ title }) => selectedTitles.includes(title));
}

/**
 * 오늘 노선에 실린 기사 (보딩패스 · 정거장 · 도착).
 * 홈 '이어서 탑승하기'처럼 고르지 않고 들어오면 후보 전체를 싣는다
 */
export function useRideArticles() {
  const selectedTitles = useRideStore((state) => state.selectedTitles);
  // 다른 뉴스 더 탑승시키기 기사는 UT용이라 노선에는 싣지 않는다 (선택·시간 표시만)
  const selected = SELECT_ARTICLES.filter(({ title }) =>
    selectedTitles.includes(title),
  );
  return selected.length > 0 ? selected : SELECT_ARTICLES;
}
