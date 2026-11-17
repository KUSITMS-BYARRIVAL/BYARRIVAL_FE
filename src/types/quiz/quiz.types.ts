// Swagger 스키마 그대로 (도메인 코드 quiz: Quiz 태그)

export type QuizChoice = { seq: number; content: string };

export type QuizProgress = {
  /** 전체 문제 수(최대 3). 0이면 출제할 문제가 없다 */
  total: number;
  answeredCount: number;
  correctCount: number;
  finished: boolean;
};

export type Quiz = {
  /** 1부터 */
  quizOrder: number;
  quizId: number;
  categoryId: number;
  categoryName: string;
  articleId: number;
  articleTitle: string;
  question: string;
  choices: QuizChoice[];
  answered: boolean;
  // 아래는 안 풀었으면 null
  selectedSeq: number | null;
  correct: boolean | null;
  answerSeq: number | null;
  explanation: string | null;
};

export type QuizSet = {
  routeId: number;
  /** 이어서 풀 문제 순서. 모두 풀었으면 null */
  nextQuizOrder: number | null;
  quizzes: Quiz[];
  progress: QuizProgress;
};

export type QuizAnswer = {
  quizId: number;
  selectedSeq: number;
  answerSeq: number;
  correct: boolean;
  explanation: string;
  progress: QuizProgress;
};
