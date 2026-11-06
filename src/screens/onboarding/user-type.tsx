import { router } from "expo-router";
import type { ComponentType } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SvgProps } from "react-native-svg";

import {
  AssetBagIllustration,
  AssetSubwayIllustration,
  AssetSuitIllustration,
} from "@/assets/illustrations";
import { Button } from "@/components/button/button";
import { Header } from "@/components/header/header";
import { ProgressStepper } from "@/components/progress-stepper/progress-stepper";
import { SelectionCard } from "@/screens/onboarding/_components/selection-card";
import { type UserType, useOnboardingStore } from "@/stores/onboarding-store";

import { DEFAULT_NICKNAME, ONBOARDING_STEPS } from "./constants";

export const USER_TYPES: {
  type: UserType;
  title: string;
  description: string;
  Asset: ComponentType<SvgProps>;
}[] = [
  {
    type: "worker",
    title: "직장인",
    description: "출근길에 읽어요",
    Asset: AssetSuitIllustration,
  },
  {
    type: "student",
    title: "학생",
    description: "등교·통학길에 읽어요",
    Asset: AssetBagIllustration,
  },
  {
    type: "other",
    title: "기타",
    description: "이동하는 시간에 읽어요",
    Asset: AssetSubwayIllustration,
  },
];

// 화면설계서 ONB-05 이동 유형 선택
export function UserTypeScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const nickname = useOnboardingStore((state) => state.nickname);
  const userType = useOnboardingStore((state) => state.userType);
  const setUserType = useOnboardingStore((state) => state.setUserType);

  return (
    <View className="flex-1 bg-default" style={{ paddingTop: top }}>
      {/* 화면설계서: 뒤로 → ONB-04, 입력한 닉네임은 스토어에 남아 유지된다 */}
      <Header onBack={() => router.back()} />
      <ScrollView className="flex-1" contentContainerClassName="gap-5 pt-3.5">
        <ProgressStepper
          total={ONBOARDING_STEPS}
          current={2}
          showVehicle
          className="mx-5"
        />
        <View className="gap-9">
          <View className="gap-1.5 px-5">
            <Text
              accessibilityRole="header"
              className="text-primary text-title1-sb"
            >
              {nickname || DEFAULT_NICKNAME}님은 어떤 유형이신가요?
            </Text>
            <Text className="text-tertiary text-body2-m">
              이동 상황에 맞춰 문구와 분량을 맞춰드려요.
            </Text>
          </View>
          <View className="gap-5">
            <View accessibilityRole="radiogroup" className="gap-2 px-5">
              {USER_TYPES.map(({ type, title, description, Asset }) => (
                <SelectionCard
                  key={type}
                  asset={<Asset />}
                  title={title}
                  description={description}
                  isSelected={userType === type}
                  onPress={() => setUserType(type)}
                />
              ))}
            </View>
            <Text className="px-6 text-tertiary text-caption1-r">
              {"마이 > 프로필에서 언제든 바꿀 수 있어요."}
            </Text>
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
          disabled={!userType}
          onPress={() => router.push("/departure-time")}
        />
      </View>
    </View>
  );
}
