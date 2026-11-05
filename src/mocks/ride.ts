import type { BoardingArticle } from "@/screens/ride/_components/boarding-pass-card";

export const RIDE_DATE_LABEL = "10월 10일 토요일";

// 맑음 외 3단계 문구는 시안이 없어 임시로 작성했다
export const CONDITIONS = [
  {
    weather: "비",
    name: "지쳤어요",
    description: "오늘은 가볍게, 짧은 기사만 읽어요.",
  },
  {
    weather: "흐림",
    name: "조금 무거워요",
    description: "부담 없는 기사로 천천히 시작해요.",
  },
  {
    weather: "보통",
    name: "평범해요",
    description: "적당한 길이의 기사로 균형 있게 읽어요.",
  },
  {
    weather: "맑음",
    name: "가뿐해요",
    description: "에너지 충만! 깊이 있는 기사도 거뜬해요.",
  },
];

// 시안 숫자(기사 7개 · 예상 20분)에 맞춰 읽는 시간을 나눴다
export const BOARDING_ARTICLES: BoardingArticle[] = [
  {
    category: "economy",
    label: "경제",
    title: "스타트업 투자 한파... 생존한 기업들의 공통점은?",
    minutes: 2,
  },
  {
    category: "tech",
    label: "테크",
    title: "생성형 AI 검색, 기존 포털 점유율을 얼마나 가져갔나",
    minutes: 3,
  },
  {
    category: "career",
    label: "커리어",
    title: "이직 시장 얼어붙자 '사내 이동'이 늘었다",
    minutes: 3,
  },
  {
    category: "career",
    label: "커리어",
    title: "주 4일제 시범 도입 1년, 생산성은 어떻게 바뀌었나",
    minutes: 2,
  },
  {
    category: "tech",
    label: "테크",
    title: "폴더블폰 판매량, 처음으로 1분기 1천만 대 넘었다",
    minutes: 4,
  },
  {
    category: "career",
    label: "커리어",
    title: "신입 채용에서 포트폴리오 비중이 커진 이유",
    minutes: 3,
  },
  {
    category: "global",
    label: "글로벌",
    title: "유럽 중앙은행, 1년 만에 금리 동결 결정",
    minutes: 3,
  },
];
