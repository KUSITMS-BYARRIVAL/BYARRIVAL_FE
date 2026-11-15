import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryBadge } from "@/components/badge/category-badge";
import { Button } from "@/components/button/button";
import { TextButton } from "@/components/button/text-button";
import { Header } from "@/components/header/header";
import { ProgressStepper } from "@/components/progress-stepper/progress-stepper";
import { TODAY_QUIZ } from "@/mocks/quiz";

import { QuizOptionButton } from "./_components/quiz-option-button";

// 고른 보기와 정답으로 각 보기의 표시 상태를 정한다
function optionState(index: number, picked: number | null, answer: number) {
  if (picked === null) return "default";
  if (index === answer) return "correct";
  return index === picked ? "dimmed" : "default";
}

// Figma 도착·퀴즈 - 오늘의 퀴즈: 보기를 누르면 바로 채점하고, 답한 뒤에 다음 문제로 넘어간다
export function QuizScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  // 고른 보기 위치. null이면 아직 답하지 않음
  const [picked, setPicked] = useState<number | null>(null);
  const quiz = TODAY_QUIZ[index]!;
  const isLast = index === TODAY_QUIZ.length - 1;
  const isWrong = picked !== null && picked !== quiz.answerIndex;

  const goNext = () => {
    if (isLast) return;
    setIndex(index + 1);
    setPicked(null);
  };

  return (
    <View className="flex-1 bg-grey-100" style={{ paddingTop: top }}>
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
      <ScrollView contentContainerClassName="gap-5 py-5">
        <ProgressStepper
          total={TODAY_QUIZ.length}
          current={index + 1}
          className="mx-5"
        />
        <View className="gap-9 px-5">
          <View className="gap-4">
            <CategoryBadge
              category={quiz.category}
              label={quiz.categoryLabel}
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
                {quiz.newsTitle}
              </Text>
            </View>
          </View>
          <View className="gap-3.5">
            <View className="gap-2">
              {quiz.options.map((option, i) => (
                <QuizOptionButton
                  key={option}
                  number={i + 1}
                  label={option}
                  state={optionState(i, picked, quiz.answerIndex)}
                  // 한 번 답하면 바꿀 수 없다
                  disabled={picked !== null}
                  onPress={() => setPicked(i)}
                />
              ))}
            </View>
            {/* Figma 도착·퀴즈 - 오답: 틀렸을 때만 해설을 보여준다 */}
            {isWrong && (
              <View
                accessibilityLiveRegion="polite"
                className="gap-1 rounded-md bg-card-wrong px-5 py-4"
              >
                <Text className="text-primary text-body2-m">
                  아쉬워요, 오답이에요.
                </Text>
                <Text className="text-danger text-body2-m">
                  {quiz.explanation}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View className="px-5" style={{ paddingBottom: Math.max(bottom, 30) }}>
        <Button
          label="다음 문제"
          size="l"
          color="neutral"
          disabled={picked === null}
          onPress={goNext}
        />
      </View>
    </View>
  );
}
