import type { Category } from "@/theme/category";

// Figma 보관함 필터 칩 순서
// TODO: 다른 화면에서도 카테고리 한글 라벨 매핑이 필요해지면 theme/category.ts의 CATEGORY_LABEL로 옮긴다 (온보딩 _constants에도 같은 라벨이 있다)
export const ARCHIVE_CATEGORIES: { value: Category; label: string }[] = [
  { value: "economy", label: "경제" },
  { value: "tech", label: "테크" },
  { value: "career", label: "커리어" },
  { value: "science", label: "과학" },
  { value: "society", label: "사회" },
  { value: "global", label: "글로벌" },
  { value: "life", label: "라이프" },
  { value: "culture", label: "문화" },
];

export const ARCHIVE_TABS = {
  article: {
    label: "기사",
    empty: "아직 담은 기사가 없어요.\n읽다가 북마크를 눌러 담아보세요",
  },
  // shortcut: 스몰토크 빈 문구는 설계서에 없어 기사 문구를 따라 정했다. 확정되면 교체
  smalltalk: {
    label: "스몰토크",
    empty: "아직 담은 스몰토크가 없어요.\n읽다가 북마크를 눌러 담아보세요",
  },
};

export type ArchiveTab = keyof typeof ARCHIVE_TABS;
