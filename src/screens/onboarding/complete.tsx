import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OnboardingFinishIllustration } from "@/assets/illustrations";
import { Button } from "@/components/button/button";
import type { Time } from "@/components/time-picker/time-picker";
import { ProgressStepper } from "@/components/progress-stepper/progress-stepper";
import { useCompleteOnboarding } from "@/hooks/mutations/use-complete-onboarding";
import { track } from "@/lib/analytics";
import { COMMUTE_WORDS, INTERESTS, USER_TYPES } from "@/screens/_constants";
import { useAuthStore } from "@/stores/auth-store";
import { useOnboardingStore } from "@/stores/onboarding-store";

import { ONBOARDING_STEPS } from "./_constants";

// 예: 8:00 → "오전 8:00", 18:30 → "오후 6:30"
const formatTime = ({ hour, minute }: Time) =>
  `${hour < 12 ? "오전" : "오후"} ${hour % 12 || 12}:${String(minute).padStart(2, "0")}`;

// 화면설계서 ONB-11 온보딩 완료: 지금까지 고른 값을 요약해 보여준다
export function OnboardingCompleteScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const userType = useOnboardingStore((state) => state.userType);
  const departureTime = useOnboardingStore((state) => state.departureTime);
  const interests = useOnboardingStore((state) => state.interests);
  const setOnboarded = useAuthStore((state) => state.setOnboarded);
  const { mutate, isPending } = useCompleteOnboarding();
  // 학생은 '등교·등굣길', 기타는 '이동·이동길'
  const { commute, route } = COMMUTE_WORDS[userType ?? "worker"];

  const summary = [
    {
      label: "이동유형",
      value: USER_TYPES.find(({ type }) => type === userType)?.title ?? "-",
    },
    { label: `${commute} 시각`, value: formatTime(departureTime) },
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
              {`${route}에 맞춰 뉴스를 골라둘게요.\n지금 바로 첫 ${route}을 시작해 보세요.`}
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
        <Button
          label={`${route} 시작하기`}
          size="l"
          color="neutral"
          disabled={isPending}
          // 필수값 누락(ONBOARDING_INCOMPLETE)은 전역 토스트
          onPress={() =>
            mutate(undefined, {
              // 완료로 저장하면 루트 가드가 홈으로 보낸다 (온보딩으로 돌아갈 수 없다)
              onSuccess: () => {
                const { startedAt } = useOnboardingStore.getState();
                track("onboarding_complete", {
                  duration_sec:
                    startedAt === null
                      ? null
                      : Math.round((Date.now() - startedAt) / 1000),
                });
                setOnboarded();
              },
            })
          }
        />
      </View>
    </View>
  );
}
