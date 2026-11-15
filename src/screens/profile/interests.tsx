import { View } from "react-native";

import { SelectionTile } from "@/screens/_components/selection-tile";
import { INTERESTS } from "@/screens/_constants";
import { useProfileStore } from "@/stores/profile-store";

import { SettingsLayout } from "./_components/settings-layout";

// Figma 마이 - 설정(관심 카테고리): 2열 그리드, 여러 개 고를 수 있고 누르면 바로 저장된다
// 시안의 분야 이름(경제·금융 등)은 앱 전체 분야와 달라 온보딩과 같은 INTERESTS를 쓰고, 시안처럼 영문 부제는 뺀다
export function ProfileInterestsScreen() {
  const interests = useProfileStore((state) => state.interests);
  const toggleInterest = useProfileStore((state) => state.toggleInterest);

  return (
    <SettingsLayout title="관심 카테고리">
      <View className="flex-row flex-wrap justify-between gap-y-2">
        {INTERESTS.map(({ value, title, Icon, SelectedIcon }) => {
          const isSelected = interests.includes(value);
          const TileIcon = isSelected ? SelectedIcon : Icon;
          return (
            <SelectionTile
              key={value}
              icon={<TileIcon />}
              title={title}
              isSelected={isSelected}
              // 마지막 하나는 빼지 못하게 해 관심 분야가 비지 않도록 한다 (온보딩 '1개 이상')
              disabled={isSelected && interests.length === 1}
              className="w-[49%]"
              onPress={() => toggleInterest(value)}
            />
          );
        })}
      </View>
    </SettingsLayout>
  );
}
