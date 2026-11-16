import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { QuizCompleteBearIllustration } from "@/assets/illustrations";
import { Button } from "@/components/button/button";
import { PALETTE } from "@/theme/colors";

// Figma 도착·퀴즈 - 종료 배경: 위 green-100 → 아래 green-400
const BACKGROUND = {
  experimental_backgroundImage: `linear-gradient(180deg, ${PALETTE.green[100]} 0%, ${PALETTE.green[400]} 100%)`,
};

// Figma 도착·퀴즈 - 종료: 맞힌 개수와 완주 캐릭터를 보여준다
export function QuizResultScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const params = useLocalSearchParams<{ correct?: string; total?: string }>();
  const correct = Number(params.correct) || 0;
  const total = Number(params.total) || 0;
  // shortcut: 시안은 모두 맞힌 경우만 있어 나머지 문구는 임시로 정했다
  const message =
    correct === total ? "모두 맞혔어요!" : `${correct}문제 맞혔어요!`;

  return (
    <View className="flex-1" style={[BACKGROUND, { paddingTop: top }]}>
      <View className="flex-1 items-center justify-center p-2.5">
        <View className="items-center gap-3.5">
          <View className="size-[200px] items-center justify-end overflow-hidden rounded-full bg-green-500">
            <QuizCompleteBearIllustration />
          </View>
          <View accessible className="items-center gap-0.5">
            <Text className="text-center text-brand text-display1-b">
              {correct}/{total}
            </Text>
            <Text className="text-center text-primary text-heading1-b">
              {message}
            </Text>
          </View>
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
