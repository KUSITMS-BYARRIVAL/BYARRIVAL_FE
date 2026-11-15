import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Chip } from "@/components/chip/chip";
import { SearchField } from "@/components/search-field/search-field";
import { RegionPanel } from "@/screens/_components/region-panel";
import { regionLabel } from "@/screens/_constants";
import { PROVINCES, REGIONS, wholeProvince } from "@/screens/_regions";
import type { Region } from "@/stores/onboarding-store";
import { useProfileStore } from "@/stores/profile-store";

import { SettingsLayout } from "./_components/settings-layout";

// 시/도·시/군/구 통합 검색 대상 (예: "강남" → 서울 강남구)
const ALL_REGIONS: Region[] = PROVINCES.flatMap((province) => [
  { province, district: null },
  ...REGIONS[province].map((district) => ({ province, district })),
]);

// Figma 마이 - 설정(근무 지역): 온보딩 근무지 선택과 같은 검색·지역 패널, 고르면 바로 저장된다
export function ProfileRegionScreen() {
  const region = useProfileStore((state) => state.region);
  const setRegion = useProfileStore((state) => state.setRegion);
  const [province, setProvince] = useState(region?.province ?? PROVINCES[0]);
  const [query, setQuery] = useState("");
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
    <SettingsLayout
      title="근무 지역"
      scrollable={false}
      contentClassName="gap-3.5"
    >
      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder="지역명 검색"
        accessibilityLabel="지역명 검색"
      />
      {keyword ? (
        <ScrollView
          className="flex-1 rounded bg-white"
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
        <View className="flex-1 gap-2">
          {region && (
            <Chip
              label={regionLabel(region)}
              accessibilityHint="눌러서 해당 지역 목록으로 이동해요"
              onPress={() => setProvince(region.province)}
              onDelete={() => setRegion(null)}
              className="self-start"
            />
          )}
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
            className="overflow-hidden rounded"
          />
        </View>
      )}
    </SettingsLayout>
  );
}
