import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button/button";
import { Header } from "@/components/header/header";
import { ProgressStepper } from "@/components/progress-stepper/progress-stepper";
import { SelectionTile } from "@/screens/onboarding/_components/selection-tile";
import { useOnboardingStore } from "@/stores/onboarding-store";

import { INTERESTS, ONBOARDING_STEPS } from "./constants";

// 화면설계서 ONB-08 관심 분야 선택
export function InterestsScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const interests = useOnboardingStore((state) => state.interests);
  const toggleInterest = useOnboardingStore((state) => state.toggleInterest);
  const count = interests.length;

  return (
    <View className="flex-1 bg-default" style={{ paddingTop: top }}>
      {/* 화면설계서: 뒤로 → ONB-07 */}
      <Header onBack={() => router.back()} />
      <ScrollView className="flex-1" contentContainerClassName="gap-5 pt-3.5">
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
            <View className="flex-row flex-wrap justify-between gap-y-2 px-5 pb-3">
              {INTERESTS.map(
                ({ value, title, subtitle, Icon, SelectedIcon }) => {
                  const isSelected = interests.includes(value);
                  const TileIcon = isSelected ? SelectedIcon : Icon;
                  return (
                    <SelectionTile
                      key={value}
                      icon={<TileIcon />}
                      title={title}
                      subtitle={subtitle}
                      isSelected={isSelected}
                      className="w-[49%]"
                      onPress={() => toggleInterest(value)}
                    />
                  );
                },
              )}
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
          disabled={count === 0}
          onPress={() => router.push("/job-group")}
        />
      </View>
    </View>
  );
}
