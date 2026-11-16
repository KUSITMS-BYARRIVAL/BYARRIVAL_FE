import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button/button";
import { TextButton } from "@/components/button/text-button";
import { Chip } from "@/components/chip/chip";
import { Header } from "@/components/header/header";
import { ProgressStepper } from "@/components/progress-stepper/progress-stepper";
import { SearchField } from "@/components/search-field/search-field";
import { useUpdateOnboarding } from "@/hooks/mutations/use-update-onboarding";
import { useGetRegions } from "@/hooks/queries/use-get-regions";
import { RegionPanel } from "@/screens/_components/region-panel";
import { type UserType, useOnboardingStore } from "@/stores/onboarding-store";
import type {
  RegionResponse,
  RegionSidoResponse,
} from "@/types/user/user.types";

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

const labelOf = ({ sidoName, sigunguName }: RegionResponse) =>
  `${sidoName} ${sigunguName}`;

// 시/도·시/군/구 통합 검색 대상 (예: "강남" → 서울 강남구)
const flatten = (sidos: RegionSidoResponse[]): RegionResponse[] =>
  sidos.flatMap(({ sidoId, name, sigungus }) =>
    sigungus.map(({ sigunguId, name: sigunguName }) => ({
      sidoId,
      sidoName: name,
      sigunguId,
      sigunguName,
    })),
  );

// 화면설계서 ONB-10 근무 지역 선택. 목록은 서버(GET /regions) 순서 그대로 쓴다
export function RegionScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const userType = useOnboardingStore((state) => state.userType);
  const region = useOnboardingStore((state) => state.region);
  const setRegion = useOnboardingStore((state) => state.setRegion);
  const { data: sidos, isPending, isError, refetch } = useGetRegions();
  const { mutate, isPending: isSaving } = useUpdateOnboarding();
  const [selectedSido, setSelectedSido] = useState(region?.sidoName ?? null);
  const [query, setQuery] = useState("");
  const copy = COPY[userType ?? "worker"];
  const keyword = query.trim();

  // 화면설계서: 시/도 기본값은 첫 번째(서울)
  const province = selectedSido ?? sidos?.[0]?.name ?? "";
  const sido = sidos?.find(({ name }) => name === province);
  const allRegions = sidos ? flatten(sidos) : [];
  const searchResults = allRegions.filter((item) =>
    labelOf(item).includes(keyword),
  );

  // 검색 결과를 고르면 해당 시/도 탭과 시/군/구를 함께 선택한다
  const selectRegion = (next: RegionResponse) => {
    setSelectedSido(next.sidoName);
    setRegion(next);
    setQuery("");
  };

  const renderList = () => {
    if (isPending) {
      return (
        <Text className="py-10 text-center text-tertiary text-body1-m">
          지역 목록을 불러오는 중이에요
        </Text>
      );
    }
    if (isError) {
      return (
        <View className="items-center gap-3 py-10">
          <Text className="text-center text-tertiary text-body1-m">
            지역 목록을 불러오지 못했어요
          </Text>
          <TextButton label="다시 시도" onPress={() => refetch()} />
        </View>
      );
    }
    if (keyword) {
      return (
        <ScrollView
          className="flex-1 bg-white"
          keyboardShouldPersistTaps="handled"
        >
          {searchResults.length === 0 ? (
            <Text className="py-10 text-center text-tertiary text-body1-m">
              검색 결과가 없어요
            </Text>
          ) : (
            searchResults.map((item) => (
              <Pressable
                key={item.sigunguId}
                accessibilityRole="button"
                className="h-[60px] justify-center px-5"
                onPress={() => selectRegion(item)}
              >
                <Text className="text-secondary text-body1-m">
                  {labelOf(item)}
                </Text>
              </Pressable>
            ))
          )}
        </ScrollView>
      );
    }
    return (
      <RegionPanel
        provinces={sidos.map(({ name }) => name)}
        selectedProvince={province}
        onProvincePress={setSelectedSido}
        districts={sido?.sigungus.map(({ name }) => name) ?? []}
        selectedDistricts={
          region?.sidoName === province ? [region.sigunguName] : []
        }
        // 단일 선택: 다른 항목을 누르면 선택이 바뀐다
        onDistrictPress={(district) => {
          const next = allRegions.find(
            (item) =>
              item.sidoName === province && item.sigunguName === district,
          );
          if (next) setRegion(next);
        }}
      />
    );
  };

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
          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder="지역명 검색"
            accessibilityLabel="지역명 검색"
            className="mx-5"
          />
          {renderList()}
        </View>
      </View>
      <View
        className="gap-5 pt-5"
        style={{ paddingBottom: Math.max(bottom, 30) }}
      >
        {region && (
          <Chip
            label={labelOf(region)}
            accessibilityHint="눌러서 해당 지역 목록으로 이동해요"
            // 검색 중이면 패널이 가려져 있어 검색어도 비워 목록을 다시 보여준다
            onPress={() => {
              setSelectedSido(region.sidoName);
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
