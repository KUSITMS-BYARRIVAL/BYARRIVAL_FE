import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryBadge } from "@/components/badge/category-badge";
import { Button } from "@/components/button/button";
import { TextButton } from "@/components/button/text-button";
import { Header } from "@/components/header/header";
import { LoadingDots } from "@/components/loading-dots/loading-dots";
import { ProgressStepper } from "@/components/progress-stepper/progress-stepper";
import { useAnswerQuiz } from "@/hooks/mutations/use-answer-quiz";
import { useGetQuizzes } from "@/hooks/queries/use-get-quizzes";
import { useGetTodayRoute } from "@/hooks/queries/use-get-today-route";
import { CATEGORY_KEY_BY_ID } from "@/screens/_constants";
import type { Quiz, QuizAnswer } from "@/types/quiz/quiz.types";

import { QuizOptionButton } from "./_components/quiz-option-button";

type Graded = Pick<
  Quiz,
  "selectedSeq" | "answerSeq" | "correct" | "explanation"
>;

// 채점 결과로 각 보기의 표시 상태를 정한다
function optionState(seq: number, graded: Graded | null) {
  if (!graded) return "default";
  if (seq === graded.answerSeq) return "correct";
  return seq === graded.selectedSeq ? "dimmed" : "default";
}

// 결과 화면에서 뒤로 가도 이미 푼 퀴즈로 돌아오지 않도록 교체한다
const goResult = () => router.replace("/quiz/result");

// Figma 도착·퀴즈 - 오늘의 퀴즈: 보기를 누르면 서버가 채점하고, 답한 뒤에 다음 문제로 넘어간다
export function QuizScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { data: today, isPending: isRoutePending } = useGetTodayRoute();
  const routeId = today?.route?.routeId;
  const { data: quizSet, isPending: isQuizPending } = useGetQuizzes(routeId);
  const { mutate: answerQuiz, isPending: isAnswering } = useAnswerQuiz();
  // 지금 푸는 문제 위치. null이면 서버가 알려준 이어 풀 문제부터
  const [index, setIndex] = useState<number | null>(null);
  const [answer, setAnswer] = useState<QuizAnswer | null>(null);

  const quizzes = quizSet?.quizzes ?? [];
  const isEmpty = quizSet?.progress.total === 0;
  // 다 풀었으면(nextQuizOrder null) 1번부터 다시 보여준다
  const current = index ?? (quizSet?.nextQuizOrder ?? 1) - 1;
  const quiz = quizzes[current];
  const isLast = current === quizzes.length - 1;
  // 이미 푼 문제(다시 보기)는 서버가 저장한 채점 결과로 보여준다
  const graded: Graded | null = answer ?? (quiz?.answered ? quiz : null);

  // 낼 문제가 없으면 결과로 보낸다
  useEffect(() => {
    if (isEmpty) goResult();
  }, [isEmpty]);

  const pick = (choiceSeq: number) => {
    if (!quiz || routeId === undefined) return;
    // 답하면 서버의 nextQuizOrder가 바뀌므로 지금 문제 위치를 고정한다
    setIndex(current);
    answerQuiz(
      { routeId, quizId: quiz.quizId, choiceSeq },
      { onSuccess: setAnswer },
    );
  };

  const goNext = () => {
    if (isLast) return goResult();
    setIndex(current + 1);
    setAnswer(null);
  };

  const header = (
    <Header
      title="오늘의 퀴즈"
      onBack={router.back}
      right={
        <TextButton
          label="나가기"
          hasArrow={false}
          onPress={() => router.back()}
        />
      }
    />
  );

  if (!quiz) {
    const isLoading =
      isRoutePending || (routeId !== undefined && isQuizPending);
    return (
      <View className="flex-1 bg-grey-100" style={{ paddingTop: top }}>
        {header}
        {isLoading || isEmpty ? (
          <LoadingDots className="flex-1" />
        ) : (
          // 도착하지 않았거나 조회에 실패하면(전역 토스트) 풀 문제가 없다
          <Text className="py-10 text-center text-tertiary text-body1-m">
            지금은 풀 수 있는 퀴즈가 없어요
          </Text>
        )}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-grey-100" style={{ paddingTop: top }}>
      {header}
      <ScrollView contentContainerClassName="gap-5 py-5">
        <ProgressStepper
          total={quizzes.length}
          current={current + 1}
          className="mx-5"
        />
        <View className="gap-9 px-5">
          <View className="gap-4">
            <CategoryBadge
              // shortcut: 매핑표에 없는 새 카테고리 id는 경제 색으로 보인다, 카테고리가 늘면 CATEGORY_KEY_BY_ID에 추가
              category={CATEGORY_KEY_BY_ID[quiz.categoryId] ?? "economy"}
              label={quiz.categoryName}
              className="self-start"
            />
            <View className="gap-1.5">
              <Text
                accessibilityRole="header"
                className="text-strong text-title1-sb"
              >
                {quiz.question}
              </Text>
              <Text className="text-tertiary text-body2-m">
                {quiz.articleTitle}
              </Text>
            </View>
          </View>
          <View className="gap-3.5">
            <View className="gap-2">
              {quiz.choices.map(({ seq, content }, i) => (
                <QuizOptionButton
                  key={seq}
                  number={i + 1}
                  label={content}
                  state={optionState(seq, graded)}
                  // 한 번 답하면 바꿀 수 없다 (서버도 처음 낸 답만 저장한다)
                  disabled={!!graded || isAnswering}
                  onPress={() => pick(seq)}
                />
              ))}
            </View>
            {/* Figma 도착·퀴즈 - 오답: 틀렸을 때만 해설을 보여준다 */}
            {graded?.correct === false && (
              <View
                accessibilityLiveRegion="polite"
                className="gap-1 rounded-md bg-card-wrong px-5 py-4"
              >
                <Text className="text-primary text-body2-m">
                  아쉬워요, 오답이에요.
                </Text>
                <Text className="text-danger text-body2-m">
                  {graded.explanation}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View className="px-5" style={{ paddingBottom: Math.max(bottom, 30) }}>
        <Button
          // shortcut: 마지막 문제 버튼은 시안이 없어 '결과 보기'로 정했다
          label={isLast ? "결과 보기" : "다음 문제"}
          size="l"
          color="neutral"
          disabled={!graded}
          onPress={goNext}
        />
      </View>
    </View>
  );
}
