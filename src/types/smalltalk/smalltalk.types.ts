// Swagger 스키마 그대로 (도메인 코드 smalltalk: Smalltalk 태그)

export type Smalltalk = {
  smalltalkId: number;
  /** 한 줄(hook) */
  hook: string;
  categoryId: number;
  categoryName: string;
  articleId: number;
  /** 연결 뉴스 제목 */
  articleTitle: string;
  /** 연결 뉴스 원문 주소 */
  sourceUrl: string;
  /** 보관함에 저장했는지 */
  scrapped: boolean;
};

export type SmalltalkList = {
  /** 서비스일(04:00 경계) */
  serviceDate: string;
  /** 카테고리 화면 순서, 같은 카테고리는 인기 순서 */
  smalltalks: Smalltalk[];
};
