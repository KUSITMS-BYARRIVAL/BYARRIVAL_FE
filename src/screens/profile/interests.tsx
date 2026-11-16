import { View } from "react-native";

import { InterestTile } from "@/screens/_components/interest-tile";
import { INTERESTS } from "@/screens/_constants";
import { useProfileStore } from "@/stores/profile-store";

import { SettingsLayout } from "./_components/settings-layout";

// 2개씩 한 줄로 나눈다 (Figma 2열 · 간격 8px)
const ROWS = Array.from({ length: Math.ceil(INTERESTS.length / 2) }, (_, i) =>
  INTERESTS.slice(i * 2, i * 2 + 2),
);

// Figma 마이 - 설정(관심 카테고리): 여러 개 고를 수 있고 누르면 바로 저장된다
export function ProfileInterestsScreen() {
  const interests = useProfileStore((state) => state.interests);
  const toggleInterest = useProfileStore((state) => state.toggleInterest);

  return (
    <SettingsLayout title="관심 카테고리" contentClassName="gap-2">
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
                // 마지막 하나는 빼지 못하게 해 관심 분야가 비지 않도록 한다
                disabled={isSelected && interests.length === 1}
                onPress={() => toggleInterest(value)}
                className="flex-1"
              />
            );
          })}
        </View>
      ))}
    </SettingsLayout>
  );
}
