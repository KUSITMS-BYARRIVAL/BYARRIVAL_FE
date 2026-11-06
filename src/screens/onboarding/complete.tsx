import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OnboardingFinishIllustration } from "@/assets/illustrations";
import { Button } from "@/components/button/button";
import type { Time } from "@/components/time-picker/time-picker";
import { ProgressStepper } from "@/components/progress-stepper/progress-stepper";
import { useOnboardingStore } from "@/stores/onboarding-store";

import { INTERESTS, ONBOARDING_STEPS, USER_TYPES } from "./constants";

// 예: 8:00 → "오전 8:00", 18:30 → "오후 6:30"
const formatTime = ({ hour, minute }: Time) =>
  `${hour < 12 ? "오전" : "오후"} ${hour % 12 || 12}:${String(minute).padStart(2, "0")}`;

// 화면설계서 ONB-11 온보딩 완료: 지금까지 고른 값을 요약해 보여준다
export function OnboardingCompleteScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const userType = useOnboardingStore((state) => state.userType);
  const departureTime = useOnboardingStore((state) => state.departureTime);
  const interests = useOnboardingStore((state) => state.interests);

  const summary = [
    {
      label: "이동유형",
      value: USER_TYPES.find(({ type }) => type === userType)?.title ?? "-",
    },
    { label: "출근 시각", value: formatTime(departureTime) },
    {
      label: "관심 카테고리",
      value:
        INTERESTS.filter(({ value }) => interests.includes(value))
          .map(({ title }) => title)
          .join(", ") || "-",
    },
  ];

  return (
    <View className="flex-1 bg-default" style={{ paddingTop: top }}>
      {/* 완료 화면이라 뒤로 가기 없이 상단 내비게이션 높이만 비워 둔다 */}
      <View className="h-11" />
      <ProgressStepper
        total={ONBOARDING_STEPS}
        current={ONBOARDING_STEPS}
        showVehicle
        className="mx-5"
      />
      <View className="flex-1 justify-center gap-9 px-5">
        <View className="items-center gap-5">
          <OnboardingFinishIllustration />
          <View className="items-center gap-2">
            <Text
              accessibilityRole="header"
              className="text-center text-primary text-heading1-b"
            >
              준비 완료!
            </Text>
            <Text className="text-center text-secondary text-body1-m">
              {
                "출근길에 맞춰 뉴스를 골라둘게요.\n지금 바로 첫 출근길을 시작해 보세요."
              }
            </Text>
          </View>
        </View>
        <View className="gap-3.5 rounded bg-white p-5">
          {summary.map(({ label, value }) => (
            <View
              key={label}
              className="flex-row items-center justify-between gap-4"
            >
              <Text className="text-secondary text-body2-m">{label}</Text>
              <Text className="flex-shrink text-right text-primary text-body2-sb">
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View
        className="px-5 pt-2"
        style={{ paddingBottom: Math.max(bottom, 30) }}
      >
        {/* TODO: 온보딩 저장 API 호출 후 홈(HOME-01)으로 이동. 홈 라우트(tabs/index)가 생기면 router.replace로 연결 */}
        <Button
          label="출근길 시작하기"
          size="l"
          color="neutral"
          onPress={() => {}}
        />
      </View>
    </View>
  );
}
