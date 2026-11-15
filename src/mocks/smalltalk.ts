import { ARCHIVE_SMALLTALKS } from "@/mocks/archive";

// 에디터픽 스몰토크 목록. 원문 링크가 있도록 보관함과 같은 탑승 기사 7개 스몰토크를 쓰고, 처음엔 아무것도 담지 않은 상태다
export const EDITOR_PICK_SMALLTALKS = ARCHIVE_SMALLTALKS.map(
  ({ id, category, label, newsTitle, url, question }) => ({
    id,
    category,
    label,
    newsTitle,
    url,
    question,
  }),
);
