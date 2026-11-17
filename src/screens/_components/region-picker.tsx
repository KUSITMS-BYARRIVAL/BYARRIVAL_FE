import type { ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { TextButton } from "@/components/button/text-button";
import { SearchField } from "@/components/search-field/search-field";
import { useGetRegions } from "@/hooks/queries/use-get-regions";
import { cn } from "@/lib/cn";
import type {
  RegionResponse,
  RegionSidoResponse,
} from "@/types/user/user.types";

import { RegionPanel } from "./region-panel";

type RegionPickerProps = {
  value: RegionResponse | null;
  onSelect: (region: RegionResponse) => void;
  /** 보고 있는 시/도 탭. null이면 서버 목록 첫 번째(서울) */
  province: string | null;
  onProvinceChange: (province: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
  /** 검색창 · 목록에 덧붙일 클래스 (예: 온보딩은 검색창만 좌우 여백, 마이는 목록 둥근 모서리) */
  searchClassName?: string;
  panelClassName?: string;
  /** 검색 중이 아닐 때 목록 위에 둘 요소 (예: 마이의 선택 지역 칩) */
  aboveList?: ReactNode;
};

export const regionLabelOf = ({ sidoName, sigunguName }: RegionResponse) =>
  `${sidoName} ${sigunguName}`;

const flatten = (sidos: RegionSidoResponse[]): RegionResponse[] =>
  sidos.flatMap(({ sidoId, name, sigungus }) =>
    sigungus.map(({ sigunguId, name: sigunguName }) => ({
      sidoId,
      sidoName: name,
      sigunguId,
      sigunguName,
    })),
  );

// 온보딩 근무지 · 마이 근무 지역에서 함께 쓰는 지역 검색 + 시/도·시/군/구 목록 (GET /regions)
// 탭 · 검색어는 사용처가 들고 있다 — 선택 칩을 누르면 그 지역 목록으로 돌아가야 해서
export function RegionPicker({
  value,
  onSelect,
  province,
  onProvinceChange,
  query,
  onQueryChange,
  searchClassName,
  panelClassName,
  aboveList,
}: RegionPickerProps) {
  const { data: sidos, isPending, isError, refetch } = useGetRegions();
  const keyword = query.trim();

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
    const regions = flatten(sidos);
    if (keyword) {
      const results = regions.filter((item) =>
        regionLabelOf(item).includes(keyword),
      );
      return (
        <ScrollView
          className={cn("flex-1 bg-white", panelClassName)}
          keyboardShouldPersistTaps="handled"
        >
          {results.length === 0 ? (
            <Text className="py-10 text-center text-tertiary text-body1-m">
              검색 결과가 없어요
            </Text>
          ) : (
            results.map((item) => (
              <Pressable
                key={item.sigunguId}
                accessibilityRole="button"
                className="h-[60px] justify-center px-5"
                onPress={() => {
                  // 검색 결과를 고르면 해당 시/도 탭과 시/군/구를 함께 선택한다
                  onProvinceChange(item.sidoName);
                  onQueryChange("");
                  onSelect(item);
                }}
              >
                <Text className="text-secondary text-body1-m">
                  {regionLabelOf(item)}
                </Text>
              </Pressable>
            ))
          )}
        </ScrollView>
      );
    }
    const current = province ?? sidos[0]?.name ?? "";
    const sido = sidos.find(({ name }) => name === current);
    return (
      <>
        {aboveList}
        <RegionPanel
          provinces={sidos.map(({ name }) => name)}
          selectedProvince={current}
          onProvincePress={onProvinceChange}
          districts={sido?.sigungus.map(({ name }) => name) ?? []}
          selectedDistricts={
            value?.sidoName === current ? [value.sigunguName] : []
          }
          // 단일 선택: 다른 항목을 누르면 선택이 바뀐다
          onDistrictPress={(district) => {
            const next = regions.find(
              (item) =>
                item.sidoName === current && item.sigunguName === district,
            );
            if (next) onSelect(next);
          }}
          className={panelClassName}
        />
      </>
    );
  };

  return (
    <>
      <SearchField
        value={query}
        onChangeText={onQueryChange}
        placeholder="지역명 검색"
        accessibilityLabel="지역명 검색"
        className={searchClassName}
      />
      {renderList()}
    </>
  );
}
