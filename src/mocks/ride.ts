import type { BoardingArticle } from "@/screens/ride/_components/boarding-pass-card";
import type { RideArticle } from "@/screens/ride/_components/stop-article";

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

// 실제 기사 7개. 분야는 앱 카테고리로 매핑했고, 원본에 없는 읽는 시간(난이도 EASY 짧게 · HARD 길게, 시안 합계 20분) · 키워드 · 이미지는 임시값이다
export const BOARDING_ARTICLES: RideArticle[] = [
  {
    category: "economy",
    label: "경제",
    title: "[단독] 'K과자 첫 수출 1000억' 눈앞…롯데 빼빼로, 새 역사",
    minutes: 2,
    date: "2026.11.04",
    press: "뉴스핌",
    keywords: ["#오늘의 브리핑"],
    url: "https://www.newspim.com/news/view/20261104000211",
    imageUrl: "https://picsum.photos/seed/byarrival-stop-1/800/600",
  },
  {
    category: "economy",
    label: "경제",
    title:
      "\"편의점마다 다른 맛이네\"…포테토칩 이어 가나초콜릿도 '도장깨기' 뜬다",
    minutes: 2,
    date: "2026.11.04",
    press: "한경닷컴",
    keywords: ["#오늘의 브리핑"],
    url: "https://www.hankyung.com/article/202611044443g",
    imageUrl: "https://picsum.photos/seed/byarrival-stop-2/800/600",
  },
  {
    category: "life",
    label: "라이프",
    title: "설거지 귀찮은 2030…물만 붓는 단백질에 지갑 연다",
    minutes: 3,
    date: "2026.11.03",
    press: "한경닷컴",
    keywords: ["#오늘의 브리핑"],
    url: "https://www.hankyung.com/article/202611033577g",
    imageUrl: "https://picsum.photos/seed/byarrival-stop-3/800/600",
  },
  {
    category: "tech",
    label: "테크",
    title: '"한국은 AI 미래 결정짓는 핵심 국가"… AMD 러브콜',
    minutes: 2,
    date: "2026.11.04",
    press: "한국경제",
    keywords: ["#오늘의 브리핑"],
    url: "https://www.hankyung.com/article/202611045302i",
    imageUrl: "https://picsum.photos/seed/byarrival-stop-4/800/600",
  },
  {
    category: "tech",
    label: "테크",
    title: "구글, TPU 판매 본격화…삼성·SK하이닉스 HBM에 '제2 엔비디아' 뜨나",
    minutes: 4,
    date: "2026.11.04",
    press: "뉴스핌",
    keywords: ["#오늘의 브리핑"],
    url: "https://www.newspim.com/news/view/20261104000460",
    imageUrl: "https://picsum.photos/seed/byarrival-stop-5/800/600",
  },
  {
    category: "society",
    label: "사회",
    title:
      "[금융권 해킹] ① K-금융의 허점, 은행·제2금융·증권사·코인 거래소도 '해킹 또 해킹'",
    minutes: 4,
    date: "2026.11.04",
    press: "뉴스핌",
    keywords: ["#오늘의 브리핑"],
    url: "https://www.newspim.com/news/view/20261103000769",
    imageUrl: "https://picsum.photos/seed/byarrival-stop-6/800/600",
  },
  {
    category: "global",
    label: "글로벌",
    title: "'블루 쓰나미' 불어닥친 미국…막 내리는 트럼프 시대",
    minutes: 3,
    date: "2026.11.04",
    press: "한국경제",
    keywords: ["#오늘의 브리핑"],
    url: "https://www.hankyung.com/article/202611045995i",
    imageUrl: "https://picsum.photos/seed/byarrival-stop-7/800/600",
  },
];

type SelectArticle = BoardingArticle & {
  imageUrl: string;
  summary: string[];
};

// 이미지는 시안 원본이 없어 임시 URL을 쓴다. 첫 기사는 시안 그대로다
export const SELECT_ARTICLES: SelectArticle[] = [
  {
    category: "economy",
    label: "경제",
    title: '한국은행, 기준금리 동결... "하반기 불확실성 여전"',
    minutes: 2,
    imageUrl: "https://picsum.photos/seed/byarrival-1/800/600",
    summary: [
      "기준금리 연 3.00% 동결 결정",
      "대외 불확실성과 물가 안정세 동시 고려",
      "하반기 인하 가능성 약 60% 전망",
    ],
  },
  {
    category: "tech",
    label: "테크",
    title: "온디바이스 AI 스마트폰, 올해 출하량 두 배로 늘어난다",
    minutes: 3,
    imageUrl: "https://picsum.photos/seed/byarrival-2/800/600",
    summary: [
      "온디바이스 AI 탑재폰 출하량 전년 대비 2배 전망",
      "통신 없이 번역 · 요약 기능 사용 가능",
      "중저가 모델까지 탑재 확대 예상",
    ],
  },
  {
    category: "career",
    label: "커리어",
    title: "MZ 직장인 10명 중 6명 '사이드 프로젝트 하고 있다'",
    minutes: 2,
    imageUrl: "https://picsum.photos/seed/byarrival-3/800/600",
    summary: [
      "직장인 61%가 본업 외 사이드 프로젝트 진행",
      "주된 이유는 추가 수입보다 자기계발",
      "회사의 겸업 허용 여부가 이직 기준으로 부상",
    ],
  },
  {
    category: "global",
    label: "글로벌",
    title: "미국 연준, 9월 금리 인하 시사... 시장은 '기대 반 우려 반'",
    minutes: 4,
    imageUrl: "https://picsum.photos/seed/byarrival-4/800/600",
    summary: [
      "연준 의장, 9월 금리 인하 가능성 언급",
      "고용 둔화 신호가 인하 근거로 제시",
      "과도한 기대는 경계해야 한다는 시각도",
    ],
  },
];

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
