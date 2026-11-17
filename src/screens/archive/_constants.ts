// shortcut: 카테고리별 기사 이미지 에셋이 아직 없어 탑승 기사 이미지 7장을 scrapId로 돌려 쓴다. assets/images/category/ 이미지가 오면 카테고리별로 교체
export const ARTICLE_IMAGES = [
  require("@/assets/images/news/stop-1.jpg"),
  require("@/assets/images/news/stop-2.jpg"),
  require("@/assets/images/news/stop-3.jpg"),
  require("@/assets/images/news/stop-4.jpg"),
  require("@/assets/images/news/stop-5.jpg"),
  require("@/assets/images/news/stop-6.jpg"),
  require("@/assets/images/news/stop-7.jpg"),
];

export const ARCHIVE_TABS = {
  article: {
    label: "기사",
    type: "ARTICLE",
    empty: "아직 담은 기사가 없어요.\n읽다가 북마크를 눌러 담아보세요",
  },
  // shortcut: 스몰토크 빈 문구는 설계서에 없어 기사 문구를 따라 정했다. 확정되면 교체
  smalltalk: {
    label: "스몰토크",
    type: "SMALLTALK",
    empty: "아직 담은 스몰토크가 없어요.\n읽다가 북마크를 눌러 담아보세요",
  },
} as const;

export type ArchiveTab = keyof typeof ARCHIVE_TABS;
