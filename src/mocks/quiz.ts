import type { Category } from "@/theme/category";

export type QuizQuestion = {
  category: Category;
  categoryLabel: string;
  question: string;
  /** 문제를 낸 기사 제목 */
  newsTitle: string;
  options: string[];
  /** options에서 정답의 위치 (0부터) */
  answerIndex: number;
  /** 틀렸을 때 보여주는 해설 */
  explanation: string;
};

// 오늘 읽은 기사로 만든 퀴즈 3문제. 1·2번은 Figma 시안 문항이고 3번은 탑승 기사(기준금리 동결)로 채운 임시값이다
// 시안의 2번 보기는 1번 보기를 복사해 둔 상태라 해설에 맞춰 보기를 정했다
export const TODAY_QUIZ: QuizQuestion[] = [
  {
    category: "career",
    categoryLabel: "커리어",
    question: "투자 한파에서 살아남은 스타트업의 공통점이 아닌 것은?",
    newsTitle: "스타트업 투자 한파... 생존한 기업들의 공통점은?",
    options: ["수익화 우선", "핵심 고객 집중", "대규모 인력 채용"],
    answerIndex: 2,
    explanation: "생존한 기업들은 채용을 늘리기보다 비용을 줄였어요.",
  },
  {
    category: "tech",
    categoryLabel: "테크",
    question: "엑시노스 2600은 Apple NPU의 몇 % 성능일까?",
    newsTitle: "삼성 AI, 어디까지 왔나? 2026년 온디바이스 AI 반도체 현황",
    options: ["약 50%", "약 70%", "약 85%"],
    answerIndex: 2,
    explanation: "Apple NPU 대비 85% 성능을 달성했어요.",
  },
  {
    category: "economy",
    categoryLabel: "경제",
    question: "한국은행이 이번에 동결한 기준금리는 연 몇 %일까?",
    newsTitle: '한국은행, 기준금리 동결... "하반기 불확실성 여전"',
    options: ["연 2.75%", "연 3.00%", "연 3.25%"],
    answerIndex: 1,
    explanation: "기준금리를 연 3.00%로 동결했어요.",
  },
];
