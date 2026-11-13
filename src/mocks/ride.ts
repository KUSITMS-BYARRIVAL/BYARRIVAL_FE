import type { RideArticle } from "@/screens/ride/_components/stop-article";

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
    image: require("@/assets/images/news/stop-1.jpg"),
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
    image: require("@/assets/images/news/stop-2.jpg"),
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
    image: require("@/assets/images/news/stop-3.jpg"),
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
    image: require("@/assets/images/news/stop-4.jpg"),
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
    image: require("@/assets/images/news/stop-5.jpg"),
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
    image: require("@/assets/images/news/stop-6.jpg"),
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
    image: require("@/assets/images/news/stop-7.jpg"),
  },
];

// 뉴스 탑승하기 후보 7개. 탑승권 기사와 같은 기사이고, AI 요약은 각 원문(url)에서 뽑은 핵심 3줄이다
const SUMMARIES = [
  [
    "빼빼로 연간 수출 1000억 원 달성 눈앞",
    "상반기 수출 530억 원, 전년 대비 27% 증가",
    "하반기 4% 안팎만 늘어도 연내 1000억 달성",
  ],
  [
    "롯데웰푸드, 채널 전용 '프리미엄 가나' 4종 출시",
    "세븐일레븐·CU·GS25·이마트마다 다른 맛 구성",
    "포테토칩 이어 초콜릿도 채널별 '도장깨기' 확산",
  ],
  [
    "국내 단백질 식품 시장 올해 8000억 원 전망",
    "2030 세대 식사 대용으로 소비 저변 확대",
    "일동후디스, 저당 파우치형 단백질 쉐이크 3종 출시",
  ],
  [
    "리사 수 CEO, 한국을 AI 생태계 핵심국으로 평가",
    "한국 기업과 개방형 AI 컴퓨팅 플랫폼 구축 추진",
    "서울서 첫 'AMD 어드밴싱 AI 월드 투어' 개최",
  ],
  [
    "구글, TPU 외부 판매 본격화…재고 5.5배 증가",
    "차세대 추론용 TPU, HBM 용량 50% 증가",
    "삼성·SK하이닉스 HBM 수요처 다변화 기대",
  ],
  [
    "은행·증권·저축은행 16곳 해킹, 약 10만 건 유출",
    "외곽 시스템 취약점과 부실한 보안 점검이 원인",
    "점검 대상 555곳 중 130곳 미흡, 실효성 논란",
  ],
  [
    "민주당, 생활비 불만 속 중간선거 압승",
    "상·하원 모두 과반 확보, 상원 최소 53석",
    "트럼프 정책 동력 상실 전망",
  ],
];

export const SELECT_ARTICLES = BOARDING_ARTICLES.map((article, i) => ({
  ...article,
  summary: SUMMARIES[i],
}));

// 보딩패스 '다른 뉴스 더 탑승시키기'에서 보여주는 추가 기사. 이미지는 시안 원본이 없어 임시 이미지를 쓴다. 첫 기사는 시안 그대로다
export const EXTRA_ARTICLES = [
  {
    category: "economy" as const,
    label: "경제",
    title: '한국은행, 기준금리 동결... "하반기 불확실성 여전"',
    minutes: 2,
    image: require("@/assets/images/news/select-1.jpg"),
    summary: [
      "기준금리 연 3.00% 동결 결정",
      "대외 불확실성과 물가 안정세 동시 고려",
      "하반기 인하 가능성 약 60% 전망",
    ],
  },
  {
    category: "tech" as const,
    label: "테크",
    title: "온디바이스 AI 스마트폰, 올해 출하량 두 배로 늘어난다",
    minutes: 3,
    image: require("@/assets/images/news/select-2.jpg"),
    summary: [
      "온디바이스 AI 탑재폰 출하량 전년 대비 2배 전망",
      "통신 없이 번역 · 요약 기능 사용 가능",
      "중저가 모델까지 탑재 확대 예상",
    ],
  },
  {
    category: "career" as const,
    label: "커리어",
    title: "MZ 직장인 10명 중 6명 '사이드 프로젝트 하고 있다'",
    minutes: 2,
    image: require("@/assets/images/news/select-3.jpg"),
    summary: [
      "직장인 61%가 본업 외 사이드 프로젝트 진행",
      "주된 이유는 추가 수입보다 자기계발",
      "회사의 겸업 허용 여부가 이직 기준으로 부상",
    ],
  },
  {
    category: "global" as const,
    label: "글로벌",
    title: "미국 연준, 9월 금리 인하 시사... 시장은 '기대 반 우려 반'",
    minutes: 4,
    image: require("@/assets/images/news/select-4.jpg"),
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

export const HOME_NICKNAME = "출근러";
export const HOME_JOB_GROUP = "마케팅";
export const HOME_STREAK = { streakDays: 7, longestDays: 12 };
export const COMMUTER_COUNT = 1284;

// 홈 탑승 버튼 상태. idle 시작 전 · paused 운행 중 이탈 · completed 오늘 완주
export const HOME_RIDE_STATUS: "idle" | "paused" | "completed" = "idle";
// 이탈한 정거장 번호 (1부터)
export const RESUME_STOP = 3;

// 새벽 4시 집계 전이면 false
export const IS_TRENDING_READY = true;

// 원문 링크가 있는 기존 기사를 재사용한다. 보고 있는 사람 수는 임시값이다
export const HOME_TRENDING = {
  jobGroup: BOARDING_ARTICLES.slice(0, 3).map((article, i) => ({
    title: article.title,
    url: article.url,
    viewers: [128, 97, 64][i],
  })),
  all: TRENDING_ARTICLES.map((article) => ({
    title: article.title,
    url: article.url,
    viewers: article.readers,
  })),
};

// 원문이 실제로 열리도록 탑승 기사를 재사용한다. 대화 문구는 보관함 목데이터와 같은 임시값이다
export const HOME_SMALLTALK = {
  category: BOARDING_ARTICLES[0].category,
  categoryLabel: BOARDING_ARTICLES[0].label,
  newsTitle: BOARDING_ARTICLES[0].title,
  url: BOARDING_ARTICLES[0].url,
  question: "“ 빼빼로가 해외에서 1000억 어치나 팔린대요. 신기하지 않아요? “",
};
