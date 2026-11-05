import { Pressable, ScrollView, Text, View } from "react-native";

import { ArrowRightSIcon, CheckCircleIcon } from "@/assets/icons";
import { cn } from "@/lib/cn";
import { PALETTE, SEMANTIC } from "@/theme/colors";

type RegionPanelProps = {
  /** 왼쪽 시·도 목록 (예: 서울, 경기) */
  provinces: string[];
  selectedProvince: string;
  onProvincePress: (province: string) => void;
  /** 선택한 시·도의 구·군 목록 (예: 서울전체, 강남구) */
  districts: string[];
  /** 체크할 구·군. 하나만 고르는지 여러 개 고르는지는 사용처에서 정한다 */
  selectedDistricts: string[];
  onDistrictPress: (district: string) => void;
  className?: string;
};

// 온보딩 근무지 선택과 프로필 근무 지역 수정에서 함께 쓰여 screens/_components에 둔다
export function RegionPanel({
  provinces,
  selectedProvince,
  onProvincePress,
  districts,
  selectedDistricts,
  onDistrictPress,
  className,
}: RegionPanelProps) {
  return (
    <View className={cn("flex-1 flex-row bg-white", className)}>
      <ScrollView
        className="w-[116px] flex-grow-0 bg-green-50"
        showsVerticalScrollIndicator={false}
      >
        {provinces.map((province) => {
          const isSelected = province === selectedProvince;
          return (
            <Pressable
              key={province}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              className={cn(
                "flex-row items-center justify-between px-5 py-[18px]",
                isSelected && "bg-green-100",
              )}
              onPress={() => onProvincePress(province)}
            >
              <Text
                className={cn(
                  "text-body1-sb",
                  isSelected ? "text-brand" : "text-secondary",
                )}
              >
                {province}
              </Text>
              {isSelected && <ArrowRightSIcon color={SEMANTIC.icon.brand} />}
            </Pressable>
          );
        })}
      </ScrollView>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {districts.map((district) => {
          const isChecked = selectedDistricts.includes(district);
          return (
            <Pressable
              key={district}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isChecked }}
              className="h-[60px] flex-row items-center gap-3"
              onPress={() => onDistrictPress(district)}
            >
              <CheckCircleIcon
                color={isChecked ? PALETTE.green[500] : PALETTE.green[100]}
              />
              <Text
                className={cn(
                  "text-body1-m",
                  isChecked ? "text-strong" : "text-secondary",
                )}
              >
                {district}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
