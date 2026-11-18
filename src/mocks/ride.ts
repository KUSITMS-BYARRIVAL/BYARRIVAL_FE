export const ARRIVAL_STREAK_DAYS = 7;

// UT 범위에서는 퀴즈를 만들지 않아 항상 안 푼 상태
export const IS_QUIZ_SOLVED = false;

// 실제 기사 3개. 카테고리 · 읽는 시간 · 읽은 사람 수는 임시값이다
export const TRENDING_ARTICLES = [
  {
    title: "배터리 3사 잡은 엘앤에프, LFP 양극재 신공장 만든다",
    label: "경제",
    minutes: 2,
    readers: 12840,
    url: "https://www.hankyung.com/article/2026110463951",
  },
  {
    title: '최태원 회장 "반도체 넘어 AI 국가로 전환해야"',
    label: "테크",
    minutes: 3,
    readers: 9312,
    url: "https://www.hankyung.com/article/2026110591741",
  },
  {
    title: "라이엇, 성수서 와일드 리프트 글로벌 팝업 연다",
    label: "문화",
    minutes: 3,
    readers: 7105,
    url: "https://www.hankyung.com/article/202611057825i",
  },
];
