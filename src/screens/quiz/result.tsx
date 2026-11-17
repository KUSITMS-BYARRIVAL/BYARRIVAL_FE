import { router } from "expo-router";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { QuizCompleteBearIllustration } from "@/assets/illustrations";
import { Button } from "@/components/button/button";
import { LoadingDots } from "@/components/loading-dots/loading-dots";
import { useGetQuizResult } from "@/hooks/queries/use-get-quiz-result";
import { useGetTodayRoute } from "@/hooks/queries/use-get-today-route";
import { PALETTE } from "@/theme/colors";

// Figma 도착·퀴즈 - 종료 배경: 위 green-100 → 아래 green-400
const BACKGROUND = {
  experimental_backgroundImage: `linear-gradient(180deg, ${PALETTE.green[100]} 0%, ${PALETTE.green[400]} 100%)`,
};

// Figma 도착·퀴즈 - 종료: 맞힌 개수와 완주 캐릭터를 보여준다
export function QuizResultScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { data: today } = useGetTodayRoute();
  const { data: result } = useGetQuizResult(today?.route?.routeId);
  const correct = result?.correctCount ?? 0;
  const total = result?.total ?? 0;
  // shortcut: 시안은 모두 맞힌 경우만 있어 나머지 문구는 임시로 정했다
  // 완독한 기사가 없으면 서버가 문제를 내지 않는다 (total 0)
  const message =
    total === 0
      ? "오늘은 풀 퀴즈가 없어요"
      : correct === total
        ? "모두 맞혔어요!"
        : `${correct}문제 맞혔어요!`;

  return (
    <View className="flex-1" style={[BACKGROUND, { paddingTop: top }]}>
      <View className="flex-1 items-center justify-center p-2.5">
        <View className="items-center gap-3.5">
          <View className="size-[200px] items-center justify-end overflow-hidden rounded-full bg-green-500">
            <QuizCompleteBearIllustration />
          </View>
          {/* 결과를 받기 전에는 0/0이 보이지 않게 한다 (실패는 전역 토스트) */}
          {!result ? (
            <LoadingDots />
          ) : (
            <View accessible className="items-center gap-0.5">
              <Text className="text-center text-brand text-display1-b">
                {correct}/{total}
              </Text>
              <Text className="text-center text-primary text-heading1-b">
                {message}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View className="px-5" style={{ paddingBottom: Math.max(bottom, 30) }}>
        <Button
          label="홈으로 돌아가기"
          size="l"
          color="neutral"
          // 탑승·도착·퀴즈 화면을 모두 닫고 홈 탭으로 돌아간다
          onPress={() => router.dismissTo("/")}
        />
      </View>
    </View>
  );
}
