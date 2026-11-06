import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OnboardingCommuteIllustration } from "@/assets/illustrations";
import { Button } from "@/components/button/button";
import { Header } from "@/components/header/header";
import { ProgressStepper } from "@/components/progress-stepper/progress-stepper";
import { Slider } from "@/components/slider/slider";
import { type UserType, useOnboardingStore } from "@/stores/onboarding-store";

import { ONBOARDING_STEPS } from "./constants";

// 손잡이가 멈추는 값. 같은 간격 눈금(5·30·90분)과 실제 값이 맞도록 30분을 정가운데(6번째) 둔다
// 화면설계서 ONB-07은 5~90분 5분 단위지만, 30분 이후는 10~15분 단위로 둔다 (기획 합의 필요)
const STOPS = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 90];
const LABELS = [
  STOPS[0],
  STOPS[(STOPS.length - 1) / 2],
  STOPS[STOPS.length - 1],
];

const ILLUSTRATION_ASPECT_RATIO = 393 / 279;

// 화면설계서 ONB-07 T1: 유형별 헤드라인
const TITLE: Record<UserType, string> = {
  worker: "출퇴근 시간에 사용할 수 있는\n시간은 몇 분인가요?",
  student: "등하교 시간에 사용할 수 있는\n시간은 몇 분인가요?",
  other: "이동 시간에 사용할 수 있는\n시간은 몇 분인가요?",
};

// 목록에 없는 값(예: 예전에 저장한 35분)은 가장 가까운 값의 위치에 둔다
const toStep = (minutes: number) =>
  STOPS.reduce(
    (best, stop, i) =>
      Math.abs(stop - minutes) < Math.abs(STOPS[best] - minutes) ? i : best,
    0,
  );

// 화면설계서 ONB-07 이동 시간 설정
export function TravelTimeScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const userType = useOnboardingStore((state) => state.userType);
  const travelMinutes = useOnboardingStore((state) => state.travelMinutes);
  const setTravelMinutes = useOnboardingStore(
    (state) => state.setTravelMinutes,
  );

  return (
    <View className="flex-1 bg-default" style={{ paddingTop: top }}>
      {/* 화면설계서: 뒤로 → ONB-06 */}
      <Header onBack={() => router.back()} />
      <ScrollView className="flex-1" contentContainerClassName="gap-5 pt-3.5">
        <ProgressStepper
          total={ONBOARDING_STEPS}
          current={4}
          showVehicle
          className="mx-5"
        />
        <View className="gap-9">
          {/* 화면설계서 ONB-07 T2: ONB-06과 같은 일러스트. 학생·기타 버전은 디자인이 나오면 교체 */}
          <View style={{ aspectRatio: ILLUSTRATION_ASPECT_RATIO }}>
            <OnboardingCommuteIllustration width="100%" height="100%" />
          </View>
          <View className="gap-5">
            <View className="gap-1.5 px-5">
              <Text
                accessibilityRole="header"
                className="text-primary text-title1-sb"
              >
                {TITLE[userType ?? "worker"]}
              </Text>
              <Text className="text-tertiary text-body2-m">
                요일별 시간은 나중에 프로필에서 따로 바꿀 수 있어요.
              </Text>
            </View>
            <View className="items-center gap-5 px-[33.5px]">
              <View className="flex-row items-center gap-0.5">
                <Text className="text-primary text-digit-b">
                  {travelMinutes}
                </Text>
                <Text className="text-secondary text-heading2-sb">분</Text>
              </View>
              <View className="w-full gap-5">
                <Slider
                  value={toStep(travelMinutes)}
                  stepCount={STOPS.length}
                  onValueChange={(step) => setTravelMinutes(STOPS[step])}
                  accessibilityLabel={`이동 시간 ${travelMinutes}분`}
                />
                <View className="flex-row justify-between">
                  {LABELS.map((minutes) => (
                    <Text key={minutes} className="text-secondary text-body3-m">
                      {minutes}분
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View
        className="px-5 pt-2"
        style={{ paddingBottom: Math.max(bottom, 20) }}
      >
        <Button
          label="다음으로"
          size="l"
          color="neutral"
          onPress={() => router.push("/interests")}
        />
      </View>
    </View>
  );
}
