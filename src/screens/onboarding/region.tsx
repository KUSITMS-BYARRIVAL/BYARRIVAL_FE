import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button/button";
import { Chip } from "@/components/chip/chip";
import { Header } from "@/components/header/header";
import { ProgressStepper } from "@/components/progress-stepper/progress-stepper";
import { useUpdateOnboarding } from "@/hooks/mutations/use-update-onboarding";
import {
  RegionPicker,
  regionLabelOf,
} from "@/screens/_components/region-picker";
import { type UserType, useOnboardingStore } from "@/stores/onboarding-store";

import { ONBOARDING_STEPS, PRIVACY_NOTE } from "./_constants";

// 화면설계서 ONB-10 T1~T3: 유형별 타이틀·서브
const COPY: Record<UserType, { title: string; description: string }> = {
  worker: {
    title: "주로 어디서 근무하시나요?",
    description: "근무지와 가까운 지역을 하나만 골라 주세요",
  },
  // 설계서 T2("통학") 대신 Figma(UT_Onboarding_Step7) 문구를 쓴다
  student: {
    title: "주로 어디로 등교하시나요?",
    description: "학교와 가까운 지역을 하나만 골라 주세요",
  },
  other: {
    title: "주로 어디로 이동하시나요?",
    description: "자주 이동하는 곳과 가까운 지역을 하나만 골라 주세요",
  },
};

// 화면설계서 ONB-10 근무 지역 선택. 목록은 서버(GET /regions) 순서 그대로 쓴다
export function RegionScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const userType = useOnboardingStore((state) => state.userType);
  const region = useOnboardingStore((state) => state.region);
  const setRegion = useOnboardingStore((state) => state.setRegion);
  const { mutate, isPending: isSaving } = useUpdateOnboarding();
  const [province, setProvince] = useState(region?.sidoName ?? null);
  const [query, setQuery] = useState("");
  const copy = COPY[userType ?? "worker"];

  return (
    <View className="flex-1 bg-default" style={{ paddingTop: top }}>
      {/* 화면설계서: 뒤로 → ONB-09 */}
      <Header onBack={() => router.back()} />
      <View className="flex-1 gap-3.5 pt-3.5">
        <ProgressStepper
          total={ONBOARDING_STEPS}
          current={7}
          showVehicle
          className="mx-5"
        />
        <View className="flex-1 gap-3.5">
          <View className="gap-1.5 px-5">
            <Text
              accessibilityRole="header"
              className="text-primary text-title1-sb"
            >
              {copy.title}
            </Text>
            <View className="gap-3.5">
              <Text className="text-tertiary text-body2-m">
                {copy.description}
              </Text>
              <Text className="text-tertiary text-caption1-r">
                {PRIVACY_NOTE}
              </Text>
            </View>
          </View>
          <RegionPicker
            value={region}
            onSelect={setRegion}
            province={province}
            onProvinceChange={setProvince}
            query={query}
            onQueryChange={setQuery}
            searchClassName="mx-5"
          />
        </View>
      </View>
      <View
        className="gap-5 pt-5"
        style={{ paddingBottom: Math.max(bottom, 30) }}
      >
        {region && (
          <Chip
            label={regionLabelOf(region)}
            accessibilityHint="눌러서 해당 지역 목록으로 이동해요"
            // 검색 중이면 패널이 가려져 있어 검색어도 비워 목록을 다시 보여준다
            onPress={() => {
              setProvince(region.sidoName);
              setQuery("");
            }}
            onDelete={() => setRegion(null)}
            className="ml-5 self-start"
          />
        )}
        <View className="px-5">
          <Button
            label="다음으로"
            size="l"
            color="neutral"
            disabled={!region || isSaving}
            onPress={() =>
              region &&
              mutate(
                { sigunguId: region.sigunguId },
                { onSuccess: () => router.push("/complete") },
              )
            }
          />
        </View>
      </View>
    </View>
  );
}
