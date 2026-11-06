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

// 화면설계서 ONB-07: 범위 5~90분, 5분 단위
const MIN_MINUTES = 5;
const MAX_MINUTES = 90;
const STEP_MINUTES = 5;
const STEP_COUNT = (MAX_MINUTES - MIN_MINUTES) / STEP_MINUTES + 1;
// 슬라이더 아래 가운데 눈금으로 보여줄 값
const MIDDLE_LABEL_MINUTES = 30;

const ILLUSTRATION_ASPECT_RATIO = 393 / 279;

// 화면설계서 ONB-07 T1: 유형별 헤드라인
const TITLE: Record<UserType, string> = {
  worker: "출퇴근 시간에 사용할 수 있는\n시간은 몇 분인가요?",
  student: "등하교 시간에 사용할 수 있는\n시간은 몇 분인가요?",
  other: "이동 시간에 사용할 수 있는\n시간은 몇 분인가요?",
};

const toStep = (minutes: number) => (minutes - MIN_MINUTES) / STEP_MINUTES;
const toMinutes = (step: number) => MIN_MINUTES + step * STEP_MINUTES;

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
                  stepCount={STEP_COUNT}
                  onValueChange={(step) => setTravelMinutes(toMinutes(step))}
                  accessibilityLabel={`이동 시간 ${travelMinutes}분`}
                />
                {/* Figma처럼 5분·30분·90분 눈금을 같은 간격으로 둔다 */}
                <View className="flex-row justify-between">
                  {[MIN_MINUTES, MIDDLE_LABEL_MINUTES, MAX_MINUTES].map(
                    (minutes) => (
                      <Text
                        key={minutes}
                        className="text-secondary text-body3-m"
                      >
                        {minutes}분
                      </Text>
                    ),
                  )}
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
          // TODO: ONB-08 관심 분야 선택으로 이동 (다음 화면 퍼블리싱 후 연결)
          onPress={() => {}}
        />
      </View>
    </View>
  );
}
