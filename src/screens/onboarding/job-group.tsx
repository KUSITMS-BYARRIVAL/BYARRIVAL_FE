import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button/button";
import { Header } from "@/components/header/header";
import { ProgressStepper } from "@/components/progress-stepper/progress-stepper";
import { cn } from "@/lib/cn";
import { SelectionTile } from "@/screens/_components/selection-tile";
import { JOB_GROUPS } from "@/screens/_constants";
import { type UserType, useOnboardingStore } from "@/stores/onboarding-store";

import { ONBOARDING_STEPS } from "./_constants";

// 화면설계서 ONB-09 T1~T3: 학생만 희망 직무로 묻는다
// 학생 설명은 설계서 T2의 긴 문구 대신 Figma(UT_Onboarding_Step6_직군)대로 직장인과 같은 문구를 쓴다
const DESCRIPTION = "직군에 맞는 뉴스와 출근길 콘텐츠를 추천해 드려요";
const TITLE: Record<UserType, string> = {
  worker: "어떤 일을 하고 계신가요?",
  student: "어떤 직무를 희망하시나요?",
  other: "어떤 일을 하고 계신가요?",
};

// 화면설계서 ONB-09 직군 선택
export function JobGroupScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const userType = useOnboardingStore((state) => state.userType);
  const jobGroup = useOnboardingStore((state) => state.jobGroup);
  const setJobGroup = useOnboardingStore((state) => state.setJobGroup);

  return (
    <View className="flex-1 bg-default" style={{ paddingTop: top }}>
      {/* 화면설계서: 뒤로 → ONB-08 */}
      <Header onBack={() => router.back()} />
      <ScrollView className="flex-1" contentContainerClassName="gap-5 pt-3.5">
        <ProgressStepper
          total={ONBOARDING_STEPS}
          current={6}
          showVehicle
          className="mx-5"
        />
        <View className="gap-3.5">
          <View className="gap-1.5 px-5">
            <Text
              accessibilityRole="header"
              className="text-primary text-title1-sb"
            >
              {TITLE[userType ?? "worker"]}
            </Text>
            <Text className="text-tertiary text-body2-m">{DESCRIPTION}</Text>
          </View>
          <View>
            {/* 화면설계서 ONB-09 3: 미선택 안내 / 선택 시 초록 "1개 선택됨" */}
            <Text
              accessibilityLiveRegion="polite"
              className={cn(
                "h-[31px] px-5 text-body2-m",
                jobGroup ? "text-brand" : "text-tertiary",
              )}
            >
              {jobGroup ? "1개 선택됨" : "직군을 하나 골라 주세요"}
            </Text>
            <View className="gap-9 px-5 pb-3">
              {/* 단일 선택: 다른 직군을 누르면 선택이 바뀐다 */}
              <View
                accessibilityRole="radiogroup"
                className="flex-row flex-wrap justify-between gap-y-2"
              >
                {JOB_GROUPS.map(
                  ({ value, title, example, Icon, SelectedIcon }) => {
                    const isSelected = jobGroup === value;
                    const TileIcon = isSelected ? SelectedIcon : Icon;
                    return (
                      <SelectionTile
                        key={value}
                        accessibilityRole="radio"
                        size="s"
                        icon={<TileIcon />}
                        title={title}
                        subtitle={example}
                        isSelected={isSelected}
                        className="w-[32%]"
                        onPress={() => setJobGroup(value)}
                      />
                    );
                  },
                )}
              </View>
              <Text className="text-center text-tertiary text-caption1-r">
                {
                  "같은 지역·직군 분들이 많이 보는 콘텐츠를 보여드리는 데만 써요.\n프로필에서 언제든 바꿀 수 있어요."
                }
              </Text>
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
          disabled={!jobGroup}
          onPress={() => router.push("/region")}
        />
      </View>
    </View>
  );
}
