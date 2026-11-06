import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button/button";
import { Chip } from "@/components/chip/chip";
import { Header } from "@/components/header/header";
import { ProgressStepper } from "@/components/progress-stepper/progress-stepper";
import { SearchField } from "@/components/search-field/search-field";
import { RegionPanel } from "@/screens/_components/region-panel";
import {
  type Region,
  type UserType,
  useOnboardingStore,
} from "@/stores/onboarding-store";

import { ONBOARDING_STEPS } from "./constants";
import { PROVINCES, REGIONS, wholeProvince } from "./regions";

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

// 화면설계서 MY-04: "○○전체"는 시/도명만 보여준다
const regionLabel = ({ province, district }: Region) =>
  district ? `${province} ${district}` : province;

// 시/도·시/군/구 통합 검색 대상 (예: "강남" → 서울 강남구)
const ALL_REGIONS: Region[] = PROVINCES.flatMap((province) => [
  { province, district: null },
  ...REGIONS[province].map((district) => ({ province, district })),
]);

// 화면설계서 ONB-10 근무 지역 선택
export function RegionScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const userType = useOnboardingStore((state) => state.userType);
  const region = useOnboardingStore((state) => state.region);
  const setRegion = useOnboardingStore((state) => state.setRegion);
  // 화면설계서: 시/도 기본값 서울
  const [province, setProvince] = useState(region?.province ?? PROVINCES[0]);
  const [query, setQuery] = useState("");
  const copy = COPY[userType ?? "worker"];
  const keyword = query.trim();

  const whole = wholeProvince(province);
  const checkedDistrict =
    region?.province === province ? (region.district ?? whole) : null;

  // 검색 결과를 고르면 해당 시/도 탭과 시/군/구를 함께 선택한다
  const selectRegion = (next: Region) => {
    setProvince(next.province);
    setRegion(next);
    setQuery("");
  };

  const searchResults = ALL_REGIONS.filter((item) =>
    regionLabel(item).includes(keyword),
  );

  return (
    <View className="flex-1 bg-default" style={{ paddingTop: top }}>
      {/* 화면설계서: 뒤로 → ONB-09 */}
      <Header onBack={() => router.back()} />
      <View className="flex-1 gap-5 pt-3.5">
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
            <Text className="text-tertiary text-body2-m">
              {copy.description}
            </Text>
          </View>
          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder="지역명 검색"
            accessibilityLabel="지역명 검색"
            className="mx-5"
          />
          {keyword ? (
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
                    key={regionLabel(item)}
                    accessibilityRole="button"
                    className="h-[60px] justify-center px-5"
                    onPress={() => selectRegion(item)}
                  >
                    <Text className="text-secondary text-body1-m">
                      {regionLabel(item)}
                    </Text>
                  </Pressable>
                ))
              )}
            </ScrollView>
          ) : (
            <RegionPanel
              provinces={PROVINCES}
              selectedProvince={province}
              onProvincePress={setProvince}
              districts={[whole, ...REGIONS[province]]}
              selectedDistricts={checkedDistrict ? [checkedDistrict] : []}
              // 단일 선택: 다른 항목을 누르면 선택이 바뀐다
              onDistrictPress={(district) =>
                setRegion({
                  province,
                  district: district === whole ? null : district,
                })
              }
            />
          )}
        </View>
      </View>
      <View
        className="gap-5 pt-5"
        style={{ paddingBottom: Math.max(bottom, 20) }}
      >
        {region && (
          <Chip
            label={regionLabel(region)}
            accessibilityHint="눌러서 해당 지역 목록으로 이동해요"
            onPress={() => setProvince(region.province)}
            onDelete={() => setRegion(null)}
            className="ml-5 self-start"
          />
        )}
        <Text className="px-5 text-center text-tertiary text-caption1-r">
          {
            "같은 지역·직군 분들이 많이 보는 콘텐츠를 보여드리는 데만 써요.\n프로필에서 언제든 바꿀 수 있어요."
          }
        </Text>
        <View className="px-5">
          <Button
            label="다음으로"
            size="l"
            color="neutral"
            disabled={!region}
            onPress={() => router.push("/complete")}
          />
        </View>
      </View>
    </View>
  );
}
