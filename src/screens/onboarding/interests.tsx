import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button/button";
import { Header } from "@/components/header/header";
import { ProgressStepper } from "@/components/progress-stepper/progress-stepper";
import { useUpdateOnboarding } from "@/hooks/mutations/use-update-onboarding";
import { useGetCategories } from "@/hooks/queries/use-get-categories";
import { InterestTile } from "@/screens/_components/interest-tile";
import { INTERESTS } from "@/screens/_constants";
import { useOnboardingStore } from "@/stores/onboarding-store";

import { ONBOARDING_STEPS } from "./_constants";
import { toCategoryIds } from "./_helpers";

// 2개씩 한 줄로 나눈다 (Figma 2열 · 간격 8px)
const ROWS = Array.from({ length: Math.ceil(INTERESTS.length / 2) }, (_, i) =>
  INTERESTS.slice(i * 2, i * 2 + 2),
);

// 화면설계서 ONB-08 관심 분야 선택 (Figma 온보딩_수정_최최종 Step5)
export function InterestsScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const interests = useOnboardingStore((state) => state.interests);
  const toggleInterest = useOnboardingStore((state) => state.toggleInterest);
  // 서버 id를 알아야 저장할 수 있어 목록을 받기 전에는 다음으로를 막는다
  const { data: categories } = useGetCategories();
  const { mutate, isPending } = useUpdateOnboarding();
  const count = interests.length;

  return (
    <View className="flex-1 bg-default" style={{ paddingTop: top }}>
      {/* 화면설계서: 뒤로 → ONB-07 */}
      <Header onBack={() => router.back()} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-3.5 pt-3.5 pb-3"
      >
        <ProgressStepper
          total={ONBOARDING_STEPS}
          current={5}
          showVehicle
          className="mx-5"
        />
        <View className="gap-3.5">
          <View className="gap-1.5 px-5">
            <Text
              accessibilityRole="header"
              className="text-primary text-title1-sb"
            >
              어떤 뉴스에 관심 있으신가요?
            </Text>
            <Text className="text-tertiary text-body2-m">
              관심 분야를 골라주세요. 여러 개 선택 가능해요.
            </Text>
          </View>
          <View>
            {/* 화면설계서 ONB-08: 0개일 때 "1개 이상 골라주세요" */}
            <Text
              accessibilityLiveRegion="polite"
              className="h-[31px] px-5 text-brand text-body2-m"
            >
              {count > 0 ? `${count}개 선택됨` : "1개 이상 골라주세요"}
            </Text>
            <View className="gap-2 px-5">
              {ROWS.map((row) => (
                <View key={row[0]!.value} className="flex-row gap-2">
                  {row.map(({ value, title, Icon, SelectedIcon }) => {
                    const isSelected = interests.includes(value);
                    return (
                      <InterestTile
                        key={value}
                        Icon={isSelected ? SelectedIcon : Icon}
                        title={title}
                        isSelected={isSelected}
                        onPress={() => toggleInterest(value)}
                        className="flex-1"
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <View
        className="px-5 pt-2"
        style={{ paddingBottom: Math.max(bottom, 30) }}
      >
        <Button
          label="다음으로"
          size="l"
          color="neutral"
          disabled={count === 0 || !categories || isPending}
          onPress={() =>
            categories &&
            mutate(
              { categoryIds: toCategoryIds(interests, categories) },
              { onSuccess: () => router.push("/job-group") },
            )
          }
        />
      </View>
    </View>
  );
}
